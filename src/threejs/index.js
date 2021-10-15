/* eslint-disable no-prototype-builtins */
import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

const ThreeBSP = require('three-js-csg')(THREE)

const TWEEN = require('@tweenjs/tween.js')

import Stats from 'stats-js'

import store from '@/store'

import mouseEvent from './btn'

// 节流
function throttle(event, time) {
  let pre = 0
  return function(...args) {
    if (Date.now() - pre > time) {
      pre = Date.now()
      event.apply(this, args)
    }
  }
}
export default class Mjs3d {
  constructor() {
    this.scene = null // 场景
    this.RTscene = []
    this.controls = null // 控制
    this.renderer = null // 渲染器
    this.camera = null // 摄像机
    // 基本配置
    this.baseConfig = {
      domId: '#canvas',
      bgcolor: '#225f93'
    }
    this.monitorCamera = [] // 监视器摄像机
    this.monitorRender = [] // 监视器渲染器

    this.stats = null
    this.point = null // 光源
    this.light = null // 太阳光
    this.width = window.innerWidth - (store.getters.sidebar.opened ? 210 : 54)
    this.height = window.innerHeight - 88
    this.btns = [] // 按钮组
    this.objects = [] // 所有要生成的物体数据
    this.sceneObject = [] // 场景里的物体
    this.mouseEventList = mouseEvent
    this.SELECTED = null // 选择的
    this.mouseClick = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()

    // 决定贴图的材质 某些材质是不会存在阴影的
    // 存在的值 Basic |  Lambert | Matcap | Phong | Physical | Standard | Toon
    this.material = 'Basic'
    // 按钮点击需要的参数
    this.createBtn = {
      usage: false
    }
  }
  onWindowResize() { // 自适应
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight - 88)
  }
  init() {
    this.initScene()
    this.initLight()
    this.initCamera()
    this.initRender()
    this.initContorls()
    this.statsHelper() // 性能辅助
    this.initAxisHelper()
    this.initObject()
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }
  // 公用方法
  commonFunc = {
    // 设置rotate
    setRotate(mesh, rotate) {
      rotate.x && mesh.rotateX(rotate.x)
      rotate.y && mesh.rotateY(rotate.y)
      rotate.z && mesh.rotateZ(rotate.z)
    },
    // 查找对象
    findObject: (_objname, source = this.sceneObject, result = []) => {
      source.map((_obj) => {
        if (_obj.name !== null && _obj.name !== '') {
          if (_obj.name === _objname) {
            result.push(_obj)
            return true
          } else if (_obj.type === 'Group') {
            this.commonFunc.findObject(_objname, _obj.children, result)
            return true
          }
        }
      })
      return result[0]
    },
    // 查找所有对象
    findAllObject: (name, arr = this.sceneObject, result = []) => {
      arr.map(item => {
        if (item.name && item.name === name) {
          result.push(item)
          return true
        }
        if (item.children && item.children.length) {
          this.commonFunc.findAllObject(name, item.children, result)
          return true
        }
      })
      return result
    },
    // 判断对象
    hasObj(_obj) {
      if (_obj != null && typeof _obj !== 'undefined') {
        return true
      }
      return false
    },
    // 复制对象
    cloneObj(obj, map = new Map()) {
      if (typeof obj === 'object' && obj !== null) {
        if (map.has(obj)) return map.get(obj)
        const data = Array.isArray(obj) ? [] : {}
        map.set(obj, data)
        for (const key in obj) {
          // eslint-disable-next-line no-prototype-builtins
          if (obj.hasOwnProperty(key)) {
            data[key] = this.cloneObj(obj[key], map)
          }
        }
        return data
      }
      return obj
    },
    setMaterials: (obj) => {
      const map = new Map()
      map.set('Basic', new THREE.MeshBasicMaterial(obj))
      map.set('Lambert', new THREE.MeshLambertMaterial(obj))
      map.set('Matcap', new THREE.MeshMatcapMaterial(obj))
      map.set('Phong', new THREE.MeshPhongMaterial(obj))
      map.set('Physical', new THREE.MeshPhysicalMaterial(obj))
      map.set('Standard', new THREE.MeshStandardMaterial(obj))
      map.set('Toon', new THREE.MeshToonMaterial(obj))
      // map.set('Depth', new THREE.MeshDepthMaterial(obj))
      // map.set('Normal', new THREE.MeshNormalMaterial(obj))
      return map.get(this.material)
    }
  }

  // 辅助坐标系
  initAxisHelper() {
    //  红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    var axisHelper = new THREE.AxisHelper(1200)
    this.scene.add(axisHelper)
  }
  // 生成所有物体
  initObject() {
    this.objectFn(this.objects)
  }
  /**
   * @description: 渲染对象的公共函数
   * @param {*} data 数组
   */
  objectFn(data) {
    data && data.forEach(item => {
      switch (item.type) {
        case 'cube':
          this.addObject(this.initCube(item))
          break
        case 'tube':
          this.addObject(this.initTube(item))
          break
        case 'plane':
          this.addObject(this.initPlane(item))
          break
        case 'cylinder':
          this.addObject(this.initCylinder(item))
          break
        case 'cabinet':
          this.addObject(this.initCabinet(item))
          break
        case 'group':
          this.addObject(this.initGroup(item))
          break
        case 'merge':
          this.addObject(this.initMerge(item))
          break
        case 'objloader':
          this.initObjLoader(item)
          break
        case 'shape':
          this.addObject(this.initShape(item))
          break
        default:
          break
      }
    })
  }
  // * 添加物体
  addObject(obj) {
    // Object.prototype.toString.call(obj) [object,Array] [object,Object]
    this.sceneObject.push(obj)
    this.scene.add(obj)
  }
  // * 移除物体
  removeObject(name) {
    const _obj = this.scene.getObjectByName(name)

    // 删除场景中的元素
    this.scene.remove(_obj)
    // 删除objects中的值
    const _index = this.sceneObject.indexOf(_obj)

    if (_index > 0) {
      this.sceneObject = this.sceneObject.splice(_index, 1)
    }
  }
  /**
   * @description:
   * @param {*} data 需要渲染的数据
   * @return {*}
   */
  createObject(data) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
      data = [data]
    }
    this.objects = [...this.objects, ...data]
    // 数组去重
    const obj = {}
    this.objects = this.objects.reduce((item, next) => {
      obj[next.name] ? '' : obj[next.name] = true && item.push(next)
      return item
    }, [])
    this.objectFn(data)
  }
  // 创建多边形
  initShape(obj) {
    const {
      x,
      y,
      z,
      depth,
      height,
      width,
      skin,
      rotate,
      bevelSize,
      bevelThickness
    } = obj

    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, height)
    shape.lineTo(width, height)
    shape.lineTo(width, 0)
    shape.lineTo(0, 0)
    const extrudeSettings = {
      depth: depth || 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: bevelSize || 1,
      bevelThickness: bevelThickness || 1
    }

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    const texture = new THREE.TextureLoader().load(skin.img)
    const material = this.commonFunc.setMaterials({
      color: skin.color || '#fff',
      map: texture || null,
      side: THREE.DoubleSide,
      transparent: skin.transparent || false,
      opacity: skin.opacity || 1
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    rotate && this.commonFunc.setRotate(mesh, rotate)
    mesh.castShadow = true
    return mesh
  }
  // 创建二维平面
  initPlane(_obj) {
    const options = _obj
    if (typeof options.pic === 'string') {
      // 传入的材质是图片路径，使用 textureloader加载图片作为材质
      const loader = new THREE.TextureLoader()
      loader.setCrossOrigin(this.crossOrigin)
      var texture = loader.load(
        options.pic,
        function() {},
        undefined,
        function() {}
      )
    }
    const MaterParam = {
      // 颜色
      color: (options.skin && options.skin.color) || '#fff',
      // 材质的参数
      map: texture || null,
      // overdraw: true,
      side: options.double ? THREE.DoubleSide : THREE.FrontSide,
      // blending: THREE.AdditiveBlending,
      transparent: options.transparent,
      // needsUpdate:true,
      // premultipliedAlpha: true,
      opacity: options.opacity
    }
    if (options.blending) {
      MaterParam.blending = THREE.AdditiveBlending // 使用饱和度叠加渲染
    }
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(options.width, options.height, 1, 1),
      new THREE.MeshPhongMaterial(MaterParam) // 一种用于具有镜面高光的光泽表面的材质。
    )
    plane.position.set(options.x, options.y, options.z)
    options.rotate && this.commonFunc.setRotate(plane, options.rotate)
    plane.name = options.name
    plane.uuid = options.uuid
    plane.castShadow = true
    return plane
  }
  // 圆柱或者三角柱
  initCylinder(obj) {
    const {
      width,
      depth,
      height,
      skin,
      radial,
      rotate
    } = obj
    const heightSegments = obj.heightSegments || 1
    const openEnded = obj.openEnded || false
    const geometry = new THREE.CylinderGeometry(width, height, depth, radial, heightSegments, openEnded)
    let texture = null
    if (skin && skin.img) {
      texture = new THREE.TextureLoader().load(skin.img)
    }
    const material = this.commonFunc.setMaterials({
      color: (skin && skin.color) || '#fff',
      map: texture || null
    })
    const cylinder = new THREE.Mesh(geometry, material)
    cylinder.position.set(obj.x, obj.y, obj.z)
    rotate && this.commonFunc.setRotate(cylinder, rotate)
    cylinder.name = obj.name
    cylinder.uuid = obj.uuid
    cylinder.castShadow = true
    return cylinder
  }
  /**
   * @description: 判断createSkin 那个方向需要重复贴图
   * @param {*} obj 数据
   * @param {*} skin 那个下面存在RX RZ RY
   * @return {*} farg sarg
   */
  createSkinParams(obj, skin) {
    let farg = null
    let sarg = null

    if (skin.RX && skin.RY) {
      farg = obj.width
      sarg = obj.height
    }

    if (skin.RX && skin.RZ) {
      farg = obj.width
      sarg = obj.depth
    }
    if (skin.RY && skin.RZ) {
      farg = obj.height
      sarg = obj.depth
    }
    return {
      farg,
      sarg
    }
  }
  /**
   * @description: cube类型的每个面贴图
   * @param {*} obj //整个data对象
   * @param {*} skin //对象中的skin
   * @param {*} face //那个面
   * @return {*}
   */
  createCubeMaterial(obj, skin, face) {
    let map = null
    if (skin[`skin${face}`] && skin[`skin${face}`].img) {
      const {
        farg,
        sarg
      } = this.createSkinParams(obj, obj.skin[`skin${face}`])
      map = this.createSkin(farg, sarg, obj.skin[`skin${face}`])
    }
    if (skin[`skin${face}`] && skin[`skin${face}`].title) {
      map = this.canvasTxture(skin[`skin${face}`].width, skin[`skin${face}`].height, skin[`skin${face}`].title)
    }

    const material = skin[`skin${face}`] && this.commonFunc.setMaterials({
      map,
      transparent: skin[`skin${face}`].transparent || false,
      opacity: skin[`skin${face}`].opacity || 1,
      side: THREE.DoubleSide,
      color: skin[`skin${face}`].color || '#fff'
    })
    return material
  }
  setFaceMaterials(obj) {
    const {
      skin,
      width,
      height
    } = obj
    const basicTexture = skin && skin.img && this.createSkin(width, height, obj.skin)
    //  MeshBasicMaterial 不受光照的影响
    const basicobj = {
      color: (skin && skin.color) || '#fff',
      transparent: (skin && skin.transparent) || false,
      opacity: (skin && skin.opacity) || 1,
      map: basicTexture || null,
      side: THREE.DoubleSide
    }
    const basicMaterial = this.commonFunc.setMaterials(basicobj)
    // 后面
    const backmaterial = skin && this.createCubeMaterial(obj, skin, 'Back')
    // 前面
    const frontmaterial = skin && this.createCubeMaterial(obj, skin, 'Front')
    const upmaterial = skin && this.createCubeMaterial(obj, skin, 'Up')
    const bottommaterial = skin && this.createCubeMaterial(obj, skin, 'Bottom')
    const leftmaterial = skin && this.createCubeMaterial(obj, skin, 'Left')
    const rightmaterial = skin && this.createCubeMaterial(obj, skin, 'Right')
    // 顺序 x前后 y前后 z前后   (front back x方向  left right 为z方向 up bottom 为y轴方向)
    const materials = [
      backmaterial || basicMaterial,
      frontmaterial || basicMaterial,
      upmaterial || basicMaterial,
      bottommaterial || basicMaterial,
      rightmaterial || basicMaterial,
      leftmaterial || basicMaterial
    ]
    return materials
  }
  /**
   * @description: 重构的生成正方体
   * @param {*} obj 传递的数据
   * @param {*} flag 是否开启 定位
   * @return {*}
   */
  initCube(obj, flag = true) {
    const {
      width,
      height,
      depth,
      x,
      y,
      z,
      rotate
    } = obj
    const geometry = new THREE.BoxGeometry(width, height, depth)
    const materials = this.setFaceMaterials(obj)
    const cube = new THREE.Mesh(geometry, materials)
    if (flag) {
      cube.position.set(x, y, z)
    }
    rotate && this.commonFunc.setRotate(cube, rotate)
    cube.castShadow = true // 判断物体是否在关照下产生投影
    // cube.receiveShadow = true; // 是否接受其他模型的投影效果
    cube.uuid = obj.uuid // 给物体添加一个id
    cube.name = obj.name // 给物体添加一个name
    return cube
  }
  /**
   * @description: 合并类型
   * @param {*} obj
   * @return {*} group组
   */
  initMerge(obj) {
    const {
      parent: pobj
    } = obj
    const type = pobj && pobj.type
    let parent = null
    obj.parent = this.commonFunc.cloneObj(obj.parent)
    const materials = this.setFaceMaterials(pobj)
    switch (type) {
      case 'cube':
        parent = this.initCube(obj.parent)
        break
      case 'cylinder':
        parent = this.initCylinder(obj.parent)
        break
      default:
        break
    }
    let result = null
    const Resultarr = []
    if (this.commonFunc.hasObj(obj.mergeChild)) {
      obj.mergeChild.length && obj.mergeChild.map((item, index) => {
        let childobj = null
        switch (item.type) {
          case 'cube':
            childobj = this.initCube(item)
            break
          case 'cylinder':
            childobj = this.initCylinder(item)
            break
          default:
            break
        }
        result = this.mergeModel(item.op, index === 0 ? parent : Resultarr[index - 1], childobj, materials)
        result.position.set(pobj.x, pobj.y, pobj.z)
        pobj.rotate && this.commonFunc.setRotate(result, pobj.rotate)
        result.name = pobj && pobj.name
        result.uuid = pobj && pobj.uuid
        result.castShadow = true
        Resultarr.push(result)
      })
    }
    return Resultarr.length && Resultarr[Resultarr.length - 1]
  }
  /**
   * @description:  柜子的每个面
   * @param {*} width 沿x的方向长度
   * @param {*} height 沿y轴方向的长度
   * @param {*} depth 沿z轴方向的长度
   * @param {*} postion 包含 x,y,z
   * @param {*} skin data数据对象的skin
   * @param {*} face  那个面 可选参数 [Left,Right,Bottom,Up,Front,Back]
   * @param {*} rotate 需要旋转的参数
   * @return {*} 每个面的基本参数
   */
  createCabinetFace(width, height, depth, position, skin, face, rotate) {
    const {
      x,
      y,
      z,
      objwidth,
      objheight,
      objdepth
    } = position
    const texture = skin[`skin${face}`] && skin[`skin${face}`].img && new THREE.TextureLoader().load(`${skin[`skin${face}`].img}`)
    const fronttexture = skin[`skin${face}`] && skin[`skin${face}`].frontimg && new THREE.TextureLoader().load(`${skin[`skin${face}`].frontimg}`)
    const cube = new THREE.BoxGeometry(width, height, depth)
    const basicMaterial = this.commonFunc.setMaterials({ // 设置基础材质和贴图
      color: skin.color || '#fff',
      transparent: skin.transparent || false,
      map: texture || null
    })
    const frontMaterial = this.commonFunc.setMaterials({
      color: skin.color || '#fff',
      transparent: skin.transparent || false,
      map: fronttexture || null
    })
    const meterial = []
    meterial.push( // x正反 y正反 z正反
      basicMaterial,
      fronttexture ? frontMaterial : basicMaterial,
      basicMaterial,
      basicMaterial,
      basicMaterial,
      basicMaterial
    )
    const mesh = new THREE.Mesh(cube, meterial)
    rotate && this.commonFunc.setRotate(mesh, rotate)
    switch (face) {
      case 'Left':
        mesh.position.set(x, y, z - objwidth / 2)
        break
      case 'Right':
        mesh.position.set(x, y, z + objwidth / 2)
        break
      case 'Bottom':
        mesh.position.set(x, y - objheight / 2, z)
        break
      case 'Back':
        mesh.position.set(x + objwidth / 2 + objdepth / 2, y, z)
        break
      default:
        break
    }

    return mesh
  }
  /**
   * @description: 柜子顶部贴图
   * @param {*} str 字体内容
   * @return {*}
   */
  canvasTxture(width, height, str, color = '#00ffff') {
    var canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    var ctx = canvas.getContext('2d')
    // var g = ctx.createLinearGradient(0, 0, 50, 40);
    var g = ctx.createLinearGradient(0, 0, width, height)
    g.addColorStop(0, '#777')
    g.addColorStop(1, '#777')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, width, height)
    ctx.textBaseline = 'top'
    ctx.font = '40px SimHei'
    ctx.fillStyle = color // 编号颜色
    var txtWidth = ctx.measureText(str).width
    ctx.fillText(str, (width - txtWidth) / 2, height / 4)
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }
  // 生成柜子 可开门
  initSpecifiCabinet(obj) {
    // 特定的柜子
    /*
    {
      uuid: '',
      type: 'cabinet',
      name: 'cabGroup',
      width: 80,
      height: 200,
      depth: 5,
      x:0,
      y: 50,
      z: 0,
      title: `A00${i+j + 1 }`, //机箱上面的标识字体
      skin: {
        color: 0x8E8E8E,
        skinUp: {
          img: 'rack_panel.jpg'
        },
        skinBottom: {
          img: 'rack_panel.jpg'
        },
        skinBack: {
          img: 'rack_panel.jpg'
        },s
        skinLeft: {
          img: 'rack_panel.jpg', //整体的贴图
          frontimg: 'cabz.jpg' //前的贴图
        },
        skinRight: {
          img: 'rack_panel.jpg',
          frontimg: 'caby.jpg' //前的贴图
        }
      },
    } */
    const {
      x,
      y,
      z,
      name,
      doorName,
      skin,
      width,
      height,
      depth,
      rotate,
      cavasWidth,
      cavasHeight
    } = obj
    const group = new THREE.Group()
    group.name = name

    const position = {
      x,
      y,
      z,
      objwidth: width,
      objheight: height,
      objdepth: depth
    }
    const leftmesh = this.createCabinetFace(width, height + depth / 2, depth, position, skin, 'Left')
    const rightmesh = this.createCabinetFace(width, height + depth / 2, depth, position, skin, 'Right')
    // 下面
    const bottommesh = this.createCabinetFace(width, depth / 2, width, position, skin, 'Bottom')
    const backmesh = this.createCabinetFace(width + depth, height + depth / 2, depth, position, skin, 'Back', {
      y: Math.PI / 2
    })

    // 上面
    const geometry = new THREE.BoxGeometry(width, depth, width)
    const texture = skin.skinUp && skin.skinUp.img && new THREE.TextureLoader().load(skin.skinUp.img)
    const material = []
    const basic = this.commonFunc.setMaterials({
      color: skin.color || '#fff',
      map: texture || null
    })
    material.push(
      basic,
      basic,
      this.commonFunc.setMaterials({
        color: skin.color || '#fff',
        map: this.canvasTxture(cavasWidth || width, cavasHeight || width, obj.title) || null
      }),
      basic,
      basic,
      basic
    )
    const upmesh = new THREE.Mesh(geometry, material)
    upmesh.position.set(x, y + height / 2 - depth / 2 + 1, z)
    upmesh.rotateY(-Math.PI / 2)

    const frontmesh = this.initCube({
      name: doorName || 'cabGroup_men',
      uuid: '',
      type: 'cube',
      width: width + depth,
      height: height,
      depth: 2,
      x: x - width / 2 - 1,
      y: y,
      z: z,
      skin: {
        color: skin.color,
        skinRight: {
          img: 'rack_door_back.jpg'
        },
        skinLeft: {
          img: 'rack_front_door.jpg'
        }
      },
      rotate: {
        x: 0,
        y: Math.PI / 2,
        z: 0
      }
    })
    group.add(leftmesh, rightmesh, bottommesh, backmesh, upmesh, frontmesh)
    group.position.set(x, y, z)
    rotate && this.commonFunc.setRotate(group, rotate)
    return group
  }
  /**
   * @description: 通用生成可开门的柜子
   * @param {*} obj
   * @return {*}
   */
  initCabinet(obj) {
    // 默认格式
    /* {
      uuid: '',
      type: 'cabinet',
      name: 'cabinet',
      doorDirection:'front',//门是那个方向
      doorName: 'cabinet_door',
      width: 200,
      height: 400,
      depth: 100,
      x: 0,
      y: 0,
      z: 0,
      skin: {
        front back 为z轴方向的  up bottom y轴方向 left right x轴方向
        下面几个参数一样的配置 就相当于cube的skin
        front: {
          skinFront:{},
          skinBack:{},
          skinUp:{},
          skinBottom:{},
          skinRight:{},
          skinLeft:{}
        },
        up: {},
        bottom: {},
        back: {},
        right: {},
        left: {}
      }
    } */
    const {
      x,
      y,
      z,
      width,
      height,
      depth,
      skin,
      rotate,
      doorName,
      name
    } = obj
    const doorDirection = obj.doorDirection || 'front'
    const baseDepth = 10
    const group = new THREE.Group()
    group.name = name
    group.specific = '机柜'
    const upObj = {
      width: width - (baseDepth * 2),
      height: baseDepth,
      name,
      depth,
      x,
      y: height - baseDepth / 2,
      z,
      skin: skin && skin.up
    }
    const up = this.initCube(upObj)

    const bottomObj = {
      width: width - (baseDepth * 2),
      height: baseDepth,
      name,
      depth,
      x,
      y,
      z,
      skin: skin && skin.bottom
    }
    const bottom = this.initCube(bottomObj)

    const rightObj = {
      name: doorDirection === 'right' ? doorName : name,
      width: baseDepth,
      height,
      depth,
      x: x + (width / 2 - baseDepth / 2),
      y: height / 2,
      z,
      skin: skin && skin.right
    }
    const right = this.initCube(rightObj)

    const leftObj = {
      name: doorDirection === 'left' ? doorName : name,
      width: baseDepth,
      height,
      depth,
      x: x - (width / 2 - baseDepth / 2),
      y: height / 2,
      z,
      skin: skin && skin.left
    }
    const left = this.initCube(leftObj)

    const backObj = {
      name: doorDirection === 'back' ? doorName : name,
      width: width - (baseDepth * 2),
      height: height - (baseDepth * 2),
      depth: baseDepth,
      x,
      y: height / 2,
      z: z - (depth / 2 - baseDepth / 2),
      skin: skin && skin.back
    }
    const back = this.initCube(backObj)

    const frontObj = {
      width: width - (baseDepth * 2),
      height: height - (baseDepth * 2),
      depth: baseDepth,
      name: doorDirection === 'front' ? doorName : name,
      x,
      y: height / 2,
      z: z + (depth / 2 - baseDepth / 2),
      skin: skin && skin.front
    }
    const front = this.initCube(frontObj)
    group.add(up, bottom, right, left, back, front)
    group.position.set(x, y, z)
    rotate && this.commonFunc.setRotate(group, rotate)
    return group
  }
  // 特殊柜子的机柜
  createSpecifiCard(obj) {
    console.log(obj)
    const _box = obj.parent.parent
    let _height = 0 // 初始高度
    // let boxheight = _box.position.y + 200
    const boxheight = obj.geometry.parameters.height || 200
    const cardWidth = obj.geometry.parameters.width || 75
    const cardDepth = 150
    let i = 0
    let ontHeight // 初始位置
    while (_height <= boxheight) {
      const _index = Math.random() * 2 > 1.5 ? 1 : 0
      const card = [{
        uuid: '',
        name: 'card',
        type: 'cube',
        width: cardWidth,
        height: 30,
        depth: cardDepth,
        x: 0,
        y: 15,
        z: 0,
        skin: {
          color: 'blue'
        }
      },
      {
        uuid: '',
        name: 'card',
        type: 'cube',
        width: cardWidth,
        height: 50,
        depth: cardDepth,
        x: 0,
        y: 25,
        z: 0,
        skin: {
          color: '#000'
        }
      }
      ]
      const _card = card[_index]
      _card.x = _box.position.x * 2
      _card.z = _box.position.z * 2

      if (i === 0) {
        ontHeight = _height + _card.height / 2
        _card.y = ontHeight
      } else {
        _card.y = _height
      }

      if (_height + _card.height < boxheight + ontHeight) {
        const cube = this.initCube(_card)
        cube.parentName = _box.name
        this.addObject(cube)
        _height += _card.height
      } else {
        return
      }
      i++
    }
  }
  // 生成机柜里面的机箱
  createCard(obj, cardBox) {
    const _box = obj.parent.parent // 这是机柜的group组
    console.log(_box)
    let _height = 10 // 初始高度
    const boxheight = obj.geometry.parameters.height || 200
    const cardWidth = obj.geometry.parameters.width > 10 ? obj.geometry.parameters.width - 20 : 100
    const cardDepth = obj.geometry.parameters.depth > 10 ? obj.geometry.parameters.depth - 20 : 140
    let i = 0
    let ontHeight // 初始位置
    while (_height <= boxheight) {
      const card = {
        uuid: '',
        name: 'card',
        type: 'cube',
        width: cardWidth,
        height: 30,
        depth: cardDepth,
        x: 0,
        y: 20,
        z: 0,
        skin: {
          color: '#fff',
          skinRight: {
            img: require('@/assets/images/3.png')
          },
          skinFront: {
            img: require('@/assets/images/3.png')
          },
          skinBack: {
            img: require('@/assets/images/3.png')
          }
        }
      }
      const _card = cardBox || card
      _card.x = _box.position.x
      _card.z = _box.position.z

      if (i === 0) {
        ontHeight = _height + _card.height / 2
        _card.y = ontHeight
      } else {
        _card.y = _height
      }

      if (_height + _card.height < boxheight + ontHeight) {
        const cube = this.initCube(_card)
        cube.parentName = _box.name
        _box.add(cube)
        _height += _card.height
      } else {
        return
      }
      i++
    }
  }
  // 生成组
  initGroup(obj) {
    const {
      x,
      y,
      z,
      rotate
    } = obj
    const group = new THREE.Group()
    if (obj.children && obj.children.length) {
      obj.children.forEach(item => {
        switch (item.type) {
          case 'cube':
            group.add(this.initCube(item))
            break
          case 'tube':
            group.add(this.initTube(item))
            break
          case 'plane':
            group.add(this.initPlane(item))
            break
          case 'cylinder':
            group.add(this.initCylinder(item))
            break
          case 'cabinet':
            group.add(this.initCabinet(item))
            break
          case 'merge':
            group.add(this.initMerge(item))
            break
          case 'group':
            group.add(this.initGroup(item))
            break
          case 'shape':
            group.add(this.initShape(item))
            break
          default:
            break
        }
      })
    }
    group.name = obj.name
    group.uuid = obj.uuid
    group.position.set(x, y, z)
    rotate && this.commonFunc.setRotate(group, rotate)
    return group
  }
  // obj mtl 3d模型加载
  initObjLoader(obj) {
    const {
      x,
      y,
      z,
      objImg,
      mtlImg,
      scale,
      rotate,
      name
    } = obj
    const _this = this
    const OBJLoader = new THREE.OBJLoader() // obj加载器
    const MTLLoader = new THREE.MTLLoader() // 材质文件加载器
    MTLLoader.load(`./images/${mtlImg}`, function(materials) {
      // 返回一个包含材质的对象MaterialCreator
      // console.log(materials);
      // obj的模型会和MaterialCreator包含的材质对应起来
      OBJLoader.setMaterials(materials)
      OBJLoader.load(`./images/${objImg}`, function(obj) {
        scale && obj.scale.set(scale.x, scale.y, scale.z) // 放大obj组对象
        rotate && _this.commonFunc.setRotate(obj, rotate)
        obj.position.set(x, y, z)
        obj.name = name
        _this.progressSuccess += 1
        // console.log(_this.progressSuccess)
        _this.LoadSuccess()
        _this.addObject(obj) // 返回的组对象插入场景中
      })
    })
  }
  // 创建皮肤
  createSkin(flength, fwidth, _obj) {
    const texture = new THREE.TextureLoader().load(_obj.img)
    let _repeat = false
    let x = null
    let y = null
    const {
      repeatx,
      repeaty,
      repeatz,
      RX,
      RY,
      RZ
    } = _obj
    const setWrap = () => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      _repeat = true
    }
    if (repeatx && repeaty) {
      setWrap()
      x = RX
      y = RY
    }
    if (repeatx && repeatz) {
      setWrap()
      x = RX
      y = RZ
    }
    if (repeaty && repeatz) {
      setWrap()
      x = RY
      y = RZ
    }
    if (_repeat) {
      texture.repeat.set(flength / x, fwidth / y)
    }
    return texture
  }
  // 合并物体
  mergeModel(mergeOp, obj1, obj2, materials) {
    const fobjBSP = new ThreeBSP(obj1)
    const sobjBSP = new ThreeBSP(obj2)
    let resultBSP = null
    if (mergeOp === '-') {
      resultBSP = fobjBSP.subtract(sobjBSP)
    } else if (mergeOp === '+') {
      resultBSP = fobjBSP.union(sobjBSP)
      return obj1
    } else if (mergeOp === '&') {
      resultBSP = fobjBSP.intersect(sobjBSP)
    } else {
      resultBSP = fobjBSP
    }
    const geometry = resultBSP.toMesh().geometry
    // 生成计算结果的几何体
    const result = new THREE.Mesh(
      geometry,
      materials
    )
    return result
  }
  // 创建场景
  initScene() {
    this.scene = new THREE.Scene()
  }
  // 添加灯光
  initLight() {
    var point = new THREE.PointLight(0xffffff, 1, 100, 2)
    point.position.set(0, 600, 0) // 点光源位置
    // point.castShadow = true;
    this.scene.add(point)
    this.point = point
    //  环境光
    var ambient = new THREE.AmbientLight(0x444444)
    this.scene.add(ambient)

    var light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(0, 500, 0)
    light.castShadow = true
    this.scene.add(light)
  }
  initCamera() {
    // 相机设置
    var k = this.width / this.height // 窗口宽高比
    // var s = 1000; //三维场景显示范围控制系数 系数越大 显示越多
    // var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
    var camera = new THREE.PerspectiveCamera(45, k, 1, 100000)
    camera.position.set(300, 2000, 5000)
    camera.lookAt(this.scene.position) // 设置相机方向（指向场景对象）
    this.camera = camera
    this.sceneObject.push(this.camera)
  }
  // 控制器
  initContorls(params) {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // this.monitorCamera.forEach((item, index) => {
    //   new THREE.OrbitControls(item, this.monitorRender[index].domElement)
    // })
  }
  statsHelper() { // 性能插件
    this.stats = new Stats()
    this.stats.domElement.style.position = 'absolute'
    this.stats.domElement.style.zIndex = '1'

    // 调整stats canvas的大小
    Array.from(this.stats.dom.children).forEach(item => {
      item.style.width = '100px'
      item.style.height = '60px'
    })
    document.querySelector(this.baseConfig.domId).appendChild(this.stats.domElement)
  }
  mouseCommon(event) {
    event.preventDefault()
    this.mouseClick.x = (event.offsetX / this.width) * 2 - 1
    this.mouseClick.y = -(event.offsetY / this.height) * 2 + 1
    this.raycaster.setFromCamera(this.mouseClick, this.camera)
    return this.raycaster.intersectObjects(this.sceneObject, true)
  }
  // 各类物体的点击事件
  documentMouseClick(event, type) {
    const intersects = this.mouseCommon(event)
    // console.log(intersects, '拿到的点击的物体')
    // intersects length 为 0 直接中断 函数
    if (!intersects.length) return
    this.SELECTED = intersects[0].object
    if (this.mouseEventList && this.mouseEventList[type] && this.mouseEventList[type].length > 0) {
      this.mouseEventList[type].map(item => {
        if (typeof item.obj_name === 'string') {
          item.obj_name === this.SELECTED.name && item.obj_event.call(this, this.SELECTED)
        } else if (item.findObject != null || typeof item.findObject === 'function') {
          item.findObject(this.SELECTED.name) && item.obj_event.call(this, this.SELECTED)
        }
      })
    }
  }
  initRender() {
    // 创建渲染对象
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(this.width, this.height)
    renderer.setClearColor(this.baseConfig.bgcolor, 1)
    renderer.shadowMap.enabled = true // 开启阴影计算
    document.querySelector(this.baseConfig.domId).appendChild(renderer.domElement) // 在特定的id下渲染
    this.renderer = renderer
    this.renderer.domElement.addEventListener('click', throttle((e) => {
      this.documentMouseClick(e, 'click')
    }, 1000), false)
    this.renderer.domElement.addEventListener('mousemove', throttle((e) => {
      this.documentMouseClick(e, 'hover')
    }, 1000), false)

    this.animation()
  }
  animation() {
    this.renderer.render(this.scene, this.camera)
    this.monitorRender.forEach((item, index) => {
      // 渲染控制面板里面的canvas
      item.render(this.scene, this.monitorCamera[index])
    })
    this.stats && this.stats.update()
    requestAnimationFrame(this.animation.bind(this))
    this.points && this.pointsAnimation()
    if (TWEEN != null && typeof TWEEN !== 'undefined') {
      TWEEN.update()
    }
  }
  /**
   * @description: 开门
   * @param {*} obj 数据
   * @param {*} type left|right
   * @param {*} degflag +|- 显示旋转往那边开 可正可负
   * @param {*} diraction 那个方向旋转
   * @param {*} doorwidth 门的宽度 width|height|depth 看数据怎么定义的
   * @return {*}
   */
  openDoor(obj, type, {
    degflag = '+',
    diraction = 'z',
    doorwidth = 'width',
    way = 'out'
  }) {
    let doorstate = 'close'
    let tempobj = null
    if (obj.doorstate) {
      doorstate = obj.doorstate
      tempobj = obj.parent
    } else {
      const _objparent = obj.parent
      tempobj = new THREE.Object3D() // 生成一个对象 中心轴为左侧门或者右侧门
      const objz = obj.geometry.parameters[doorwidth] / 2
      tempobj.position.set(
        diraction === 'x' ? obj.position.x + (type === 'left' ? -objz : objz) : obj.position.x,
        diraction === 'y' ? obj.position.y + (type === 'left' ? -objz : objz) : obj.position.y,
        diraction === 'z' ? obj.position.z + (type === 'left' ? -objz : objz) : obj.position.z
      )
      obj.position.set(
        diraction === 'x' ? type === 'left' ? objz : -objz : 0,
        diraction === 'y' ? type === 'left' ? objz : -objz : 0,
        diraction === 'z' ? type === 'left' ? objz : -objz : 0)
      tempobj.add(obj)
      _objparent.add(tempobj)
    }

    obj.doorstate = doorstate === 'close' ? 'open' : 'close'
    const deg = 0.25 * 2 * (degflag === '-' ? -Math.PI : Math.PI)

    const None = TWEEN.Easing.Linear.None
    const out = TWEEN.Easing.Elastic.Out
    new TWEEN.Tween(tempobj.rotation)
      .to({
        y: doorstate === 'close' ? (type === 'left' ? -deg : deg) : 0 * 0.25 * Math.PI
      },
      1000
      )
      .easing(way === 'out' ? out : None)
      .start()
  }
  /*
   * 打开电动门
   * */
  opengateDoor(obj) {
    let doorstate = 'close'
    const left = this.commonFunc.findObject('gateDoorLeft')
    const right = this.commonFunc.findObject('gateDoorRight')
    if (left.doorstate && right.doorstate) {
      doorstate = left.doorstate || right.doorstate
    }
    left.doorstate = doorstate === 'close' ? 'open' : 'close'
    right.doorstate = doorstate === 'close' ? 'open' : 'close'
    new TWEEN.Tween(left.position)
      .to({
        z: doorstate === 'close' ? left.position.z - 300 : left.position.z + 300
      },
      1000
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start()

    new TWEEN.Tween(right.position)
      .to({
        z: doorstate === 'close' ? right.position.z + 300 : right.position.z - 300
      },
      1000
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start()
  }
  // 添加直线
  addLine(p1, p2, color = 0x70dbe1, linewidth) {
    const geometry = new THREE.BufferGeometry()

    const LineCurve = new THREE.LineCurve3(p1, p2)
    const pointArr = LineCurve.getPoints(10)
    geometry.setFromPoints(pointArr)
    const material = new THREE.LineBasicMaterial({
      color,
      linewidth
    })
    const line = new THREE.Line(geometry, material)
    return line
  }
  /*
   * 平移打开
   * obj 需要打开的对象
   * direction 方向 x y z
   * num 需要平移的值
   * */
  openDrawer(obj, direction = 'x', num = 80) {
    let drawer = 'close'
    if (obj.drawer) {
      drawer = obj.drawer
    }
    obj.drawer = drawer === 'close' ? 'open' : 'close'
    const deg = drawer === 'close' ? obj.position[direction] + num : obj.position[direction] - num
    new TWEEN.Tween(obj.position)
      .to({
        x: direction === 'x' ? deg : obj.position.x,
        y: direction === 'y' ? deg : obj.position.y,
        z: direction === 'z' ? deg : obj.position.z
      },
      1000
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start()
  }
  // * 创建轮廓
  createEdges(obj) {
    const {
      width,
      height,
      depth,
      x,
      y,
      z
    } = obj
    const skinColor = '#ffffff' // 背景颜色
    const cubeGeometry = new THREE.BoxGeometry(width, height, depth)
    const edges = new THREE.EdgesGeometry(cubeGeometry)
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: skinColor
    })
    const edgesLine = new THREE.LineSegments(edges, edgesMaterial)
    edgesLine.position.set(x, y, z)
    edgesLine.name = obj.name
    return edgesLine
  }
  // !type 分为 group组 或者 直接添加到scene下的
  setEsg(width, height, depth, _obj, group) {
    const esgobj = {
      uuid: '',
      name: 'usage',
      type: 'cube',
      depth,
      width,
      height,
      x: _obj.position.x * 2,
      y: height / 2 + 10,
      z: _obj.position.z * 2
    }
    // 根据容量显示不同的颜色
    let _skinColor
    const capaHeight = Math.floor(Math.random() * 2)
    if (capaHeight < 0.5) {
      _skinColor = 0x0af60a // 绿色
    } else if (capaHeight < 1) {
      _skinColor = 0xf7f807 // 黄色
    } else if (capaHeight < 1.5) {
      _skinColor = 0xf79707 // 橙色
    } else if (capaHeight < 2) {
      _skinColor = 0xf80404 // 红色
    }
    const cubeobj = {
      uuid: '',
      name: 'usage',
      type: 'cube',
      depth,
      width,
      height,
      x: _obj.position.x * 2,
      y: capaHeight === 0 ? 10 : (height / 2) - capaHeight,
      z: _obj.position.z * 2,
      skin: {
        color: _skinColor
      }
    }
    const cube = this.initCube(cubeobj)
    new TWEEN.Tween(cube.scale)
      .to({
        y: capaHeight
      },
      3000
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .onComplete(function() {})
      .start()
    const edgesLine = this.createEdges(esgobj)
    if (_obj.type === 'Group') {
      group.add(cube)
      group.add(edgesLine)
      this.addObject(group)
    } else {
      this.addObject(cube)
      this.addObject(edgesLine)
    }
  }

  addUsage2(name) {
    if (!this.createBtn.usage) {
      this.createBtn.usage = true
      const arr = this.commonFunc.findAllObject(name)
      console.log(arr)
      const parentGroup = []
      const digui = (arr) => {
        arr.forEach(item => {
          if (item.children && item.children.length) {
            if (!item.specific) {
              parentGroup.push(this.initGroup({
                name: 'usage',
                x: item.position.x,
                y: item.position.y,
                z: item.position.z
              }))
            }
            digui(item.children)
          }
          // 这是cabinet自身的组
          if (item.specific === '机柜') {
            console.log(parentGroup)
            const upMesh = item.children[0]
            const Front = item.children[5]

            const width = upMesh.geometry && upMesh.geometry.parameters.width
            const depth = upMesh.geometry && upMesh.geometry.parameters.depth
            const height = Front.geometry && Front.geometry.parameters.height

            // setEsg(width, height, depth, item, parentGroup)
          }
        })
      }

      digui(arr)
    }
  }
  // 生成Tube 管道缓冲几何体
  initTube(obj) {
    const {
      pathArr,
      radius,
      skin,
      name
    } = obj
    const path = this.createPath(pathArr)
    const geometry = new THREE.TubeGeometry(path, 3000, radius, 8, false)
    const material = new THREE.MeshBasicMaterial({
      color: (skin && skin.color) || '#fff',
      transparent: (skin && skin.transparent) || null,
      opacity: (skin && skin.opacity) || 1,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = name
    return mesh
  }
  // 生成curbePath 用于tube管道的path
  createPath(pointsArr) {
    pointsArr = pointsArr.map((point) => new THREE.Vector3(...point)) // 将参数数组转换成点数组的形式

    // 方法一：自定义三维路径 curvePath
    const path = new THREE.CurvePath()
    for (let i = 0; i < pointsArr.length - 1; i++) {
      const lineCurve = new THREE.LineCurve3(pointsArr[i], pointsArr[i + 1]) // 每两个点之间形成一条三维直线
      path.curves.push(lineCurve) // curvePath有一个curves属性，里面存放组成该三维路径的各个子路径
    }

    return path
  }
  //* 3d扇形轮播图
  addShapeDRN(obj) {
    // Arc circle圆弧drn
    /**
     * absarc ( x : Float, y : Float, radius : Float, startAngle : Float, endAngle : Float, clockwise : Float ) : null
     * x, y -- 弧线的绝对中心。
     * radius -- 弧线的半径。
     * startAngle -- 起始角,以弧度来表示。
     *endAngle -- 终止角,以弧度来表示。
     *clockwise -- 以顺时针方向创建(扫过)弧线。默认值为false。
     * ;type {Shape}
     */
    /**
     *.arc ( x : Float, y : Float, radius : Float, startAngle : Float, endAngle : Float, clockwise : Float ) : null
     x, y -- 弧线的中心来自上次调用后的偏移量。
     radius -- 弧线的半径。
     startAngle -- 起始角,以弧度来表示。
     endAngle -- 终止角,以弧度来表示。
     clockwise -- 以顺时针方向创建(扫过)弧线。默认值为false。
     */
    var arcShapeDrn01 = new THREE.Shape()
    //  需要长:280,高300 平分6分,60度,中间有间隙取50度, 通过公式,为L=n× π× r/180,L=α× r。其中n是圆心角度数,r是半径,L是圆心角弧长得 r=320,n=50,弧度=280,
    arcShapeDrn01.moveTo(260, 0)
    arcShapeDrn01.lineTo(270, 0)
    arcShapeDrn01.absarc(0, 0, 270, 0, Math.PI * 2 / 6 / 6 * 5, false)
    arcShapeDrn01.absarc(0, 0, 260, Math.PI * 2 / 6 / 6 * 5, 0, true)
    var shape = arcShapeDrn01

    /**
      *curveSegments — int,曲线上点的数量,默认值是12。
      steps — int,用于沿着挤出样条的深度细分的点的数量,默认值为1。
      depth — float,挤出的形状的深度,默认值为100。
      bevelEnabled — bool,对挤出的形状应用是否斜角,默认值为true。
      bevelThickness — float,设置原始形状上斜角的厚度。默认值为6。
      bevelSize — float。斜角与原始形状轮廓之间的延伸距离,默认值为bevelThickness-2。
      bevelSegments — int。斜角的分段层数,默认值为3。
      extrudePath — THREE.CurvePath对象。一条沿着被挤出形状的三维样条线。
      UVGenerator — Object。提供了UV生成器函数的对象。
      */
    var extrudeSettings = {
      depth: 350,
      bevelEnabled: false,
      bevelSegments: 9,
      steps: 2,
      bevelSize: 0,
      bevelThickness: 0
    }
    const x = -500
    const y = 450
    const z = 0

    const rx = Math.PI / 2
    const ry = 0
    const rz = 0
    const s = 1
    const group = new THREE.Group()
    group.name = '3d'
    group.position.set(0, 0, 0)

    const texture = new THREE.TextureLoader().load(require('../assets/images/scene.png'))
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
    texture.repeat.set(0.004, 0.001)
    // 弧线
    // const geometry = new THREE.ShapeBufferGeometry(shape)
    // const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    //   side: THREE.DoubleSide,
    //   map: texture
    // }))
    // mesh.position.set(x, y, z, -175)
    // mesh.rotation.set(rx, ry, rz)
    // mesh.scale.set(s, s, s)
    // group.add(mesh)

    const geometry1 = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
    const material = new THREE.MeshBasicMaterial({
      color: 0x6188d2,
      // opacity: 0.8,
      // transparent: true,
      map: texture
    })
    var mesh1 = new THREE.Mesh(geometry1, material)
    mesh1.position.set(x, y, z)
    mesh1.rotation.set(rx, ry, rz)
    mesh1.scale.set(s, s, s)
    group.add(mesh1)

    var mesh2 = mesh1.clone()
    mesh2.rotateZ(Math.PI * 2 / 5)
    group.add(mesh2)
    var mesh3 = mesh2.clone()
    mesh3.rotateZ(Math.PI * 2 / 5)
    group.add(mesh3)
    var mesh4 = mesh3.clone()
    mesh4.rotateZ(Math.PI * 2 / 5)
    group.add(mesh4)
    var mesh5 = mesh4.clone()
    mesh5.rotateZ(Math.PI * 2 / 5)
    group.add(mesh5)

    this.addObject(group)
  }
}
