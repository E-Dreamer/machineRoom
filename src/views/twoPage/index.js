import Mjs3d from '@/threejs'
import * as THREE from 'three'
import btn from './btn'
export default class Twopage extends Mjs3d {
  constructor(...args) {
    super(...args)
    this.usage = false
    this.baseConfig.domId = '#twopage'
    this.mouseEventList = btn
  }
  // * 生成管道的方法
  setPipeLine() {
    const allGroup = new THREE.Group()
    allGroup.name = 'allPipeLine'
    allGroup.position.set(-3000, 0, -2000)
    const groupArr = [{
      x: 650,
      y: 400,
      z: 2700
    },
    {
      x: 4050,
      y: 400,
      z: 2700
    },
    {
      x: 5050,
      y: 400,
      z: 2700
    }
    ]
    groupArr.forEach((item, index) => {
      const group = new THREE.Group()
      group.position.set(item.x, item.y, item.z)

      // 机柜上的管道
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
          const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(i === 0 ? 160 + 40 : -160, 0, -30 + j * 150),
            new THREE.Vector3(i === 0 ? 130 + 40 : -130, 100, -30 + j * 150),
            new THREE.Vector3(i === 0 ? 50 + 40 : -50, 150, 0 + j * 150),
            new THREE.Vector3(i === 0 ? 20 + 40 : -20, 180, 0 + j * 150),
            i === 0
              ? new THREE.Vector3(40, 200, 0 + j * 150)
              : new THREE.Vector3(0, 200, 0 + j * 150),
            i === 0
              ? new THREE.Vector3(30, 220, 0 + j * 150)
              : new THREE.Vector3(10, 220, 0 + j * 150)
          ])
          const geometry = new THREE.TubeGeometry(path, 64, 10, 8, false)
          const material = new THREE.MeshBasicMaterial({
            color: i === 1 && j === 1 ? '#854c4c' : '#3d82c7',
            transparent: true,
            opacity: 0.6
          })
          const mesh = new THREE.Mesh(geometry, material)
          mesh.name = '管道'
          group.add(mesh)
        }
      }
      // 每个组单独的管道
      if (index === 0) {
        const arr = [
          [20, 220, -100],
          [20, 230, 1350],
          [20, -300, 1350],
          [20, -300, 1400]
        ]
        const mesh = this.initTube({
          uuid: '',
          name: '管道',
          pathArr: arr,
          radius: 15,
          skin: {
            color: '#3d82c7',
            transparent: true,
            opacity: 0.6
          }
        })
        group.add(mesh)
      }
      if (index === 1) {
        const arr = [
          [20, 230, 1200],
          [20, 230, -900],
          [1800, 230, -900],
          [1800, 230, -800],
          [1800, 150, -800],
          [2000, 150, -800],
          [2000, -200, -800],
          [2050, -200, -800]
        ]
        const mesh = this.initTube({
          uuid: '',
          name: '管道',
          pathArr: arr,
          radius: 15,
          skin: {
            color: '#3d82c7',
            transparent: true,
            opacity: 0.6
          }
        })
        group.add(mesh)
      }
      if (index === 2) {
        const arr = [
          [20, 230, 1200],
          [20, 230, -800],
          [700, 230, -800],
          [700, 230, -700],
          [700, 150, -700],
          [900, 150, -700],
          [900, 150, -800]
        ]
        const mesh = this.initTube({
          uuid: '',
          name: '管道',
          pathArr: arr,
          radius: 15,
          skin: {
            color: '#3d82c7',
            transparent: true,
            opacity: 0.6
          }
        })
        group.add(mesh)
      }
      group.name = '管道组'
      allGroup.add(group)
      this.addObject(allGroup)
    })
  }
  //* 生成 监视器
  setMonitor(obj) {
    if (obj) {
      var {
        x,
        y,
        z,
        rotate,
        id,
        cameraRotate,
        lookAt,
        cameraConfig
      } = obj
    }
    // 整个监视器组
    const monitorObj = {
      uuid: '',
      name: 'monitor',
      type: 'group',
      x: x || -950,
      y: y || 300,
      z: z || 300,
      rotate: rotate || {},
      children: [{
        uuid: '',
        name: 'monitor',
        type: 'cube',
        width: 10,
        height: 50,
        depth: 30,
        x: 0,
        y: 0,
        z: 0,
        skin: {
          color: '#fff'
        }
      },
      {
        uuid: '',
        type: 'cylinder',
        name: 'monitor',
        width: 15,
        height: 15,
        depth: 5,
        x: 10,
        y: 0,
        z: 0,
        skin: {
          color: '#000'
        },
        rotate: {
          z: Math.PI / 2
        }
      },
      {
        uuid: '',
        name: 'monitor',
        type: 'cylinder',
        width: 5,
        height: 5,
        depth: 100,
        x: 50,
        y: 0,
        z: 0,
        skin: {
          color: '#fff'
        },
        rotate: {
          z: Math.PI / 2
        }
      },
      {
        uuid: '',
        name: 'monitor',
        type: 'cylinder',
        width: 8,
        height: 8,
        depth: 50,
        x: 100,
        y: 10,
        z: 0,
        skin: {
          color: '#fff'
        }
      }
      ]
    }

    const monitor = this.initGroup(monitorObj)

    // 监视器头组
    const group = new THREE.Group()
    group.position.set(100, 30, 0)
    group.name = 'monitorSpin'

    const geometry = new THREE.BufferGeometry()
    // 底座
    const trape = [
      // 梯形
      0,
      0,
      15,
      -15,
      5,
      15,
      -15,
      10,
      15,

      0,
      0,
      15,
      -15,
      10,
      15,
      15,
      10,
      15,

      0,
      0,
      15,
      15,
      10,
      15,
      15,
      5,
      15,

      // 梯形
      0,
      0,
      -15,
      -15,
      5,
      -15,
      -15,
      10,
      -15,

      0,
      0,
      -15,
      -15,
      10,
      -15,
      15,
      10,
      -15,

      0,
      0,
      -15,
      15,
      10,
      -15,
      15,
      5,
      -15,

      // 梯形前面两个正方形
      15,
      5,
      15,
      0,
      0,
      15,
      0,
      0,
      -15,

      15,
      5,
      15,
      0,
      0,
      -15,
      15,
      5,
      -15,

      15,
      5,
      15,
      15,
      10,
      15,
      15,
      10,
      -15,

      15,
      5,
      15,
      15,
      10,
      -15,
      15,
      5,
      -15,

      -15,
      5,
      15,
      0,
      0,
      15,
      0,
      0,
      -15,

      -15,
      5,
      15,
      0,
      0,
      -15,
      -15,
      5,
      -15,

      -15,
      5,
      15,
      -15,
      10,
      15,
      -15,
      10,
      -15,

      -15,
      5,
      15,
      -15,
      10,
      -15,
      -15,
      5,
      -15,

      15,
      10,
      15,
      15,
      10,
      -15,
      -15,
      10,
      -15,

      15,
      10,
      15,
      -15,
      10,
      -15,
      -15,
      10,
      15
    ]
    // 监视器内部
    const monitorArr = [
      50,
      10,
      20,
      -50,
      10,
      20,
      -50,
      50,
      20,

      50,
      10,
      20,
      -50,
      50,
      20,
      70,
      50,
      20,

      50,
      10,
      -20,
      -50,
      10,
      -20,
      -50,
      50,
      -20,

      50,
      10,
      -20,
      -50,
      50,
      -20,
      70,
      50,
      -20,

      // 顶面
      -50,
      50,
      20,
      -50,
      50,
      -20,
      70,
      50,
      -20,

      -50,
      50,
      20,
      70,
      50,
      20,
      70,
      50,
      -20,

      // 背面
      -50,
      10,
      20,
      -50,
      50,
      20,
      -50,
      50,
      -20,

      -50,
      10,
      20,
      -50,
      10,
      -20,
      -50,
      50,
      -20,
      // 底部
      -50,
      10,
      20,
      -50,
      10,
      -20,
      50,
      10,
      -20,

      -50,
      10,
      20,
      50,
      10,
      20,
      50,
      10,
      -20,

      // 需要贴图的面
      50,
      10,
      20,
      70,
      50,
      20,
      70,
      50,
      -20,

      50,
      10,
      20,
      50,
      10,
      -20,
      70,
      50,
      -20
    ]

    // 外壳
    const shell = [
      75,
      25,
      22,
      -62,
      25,
      22,
      -62,
      55,
      22,

      75,
      25,
      22,
      90,
      55,
      22,
      -62,
      55,
      22,

      75,
      25,
      -22,
      -62,
      25,
      -22,
      -62,
      55,
      -22,

      75,
      25,
      -22,
      90,
      55,
      -22,
      -62,
      55,
      -22,

      // 顶部
      90,
      55,
      22,
      -62,
      55,
      22,
      -62,
      55,
      -22,

      90,
      55,
      22,
      -62,
      55,
      -22,
      90,
      55,
      -22
    ]
    const points = new Float32Array([...trape, ...monitorArr, ...shell])
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
    // 两种写法
    // geometry.attributes.position  = new THREE.BufferAttribute(points1, 3)
    const material = this.commonFunc.setMaterials({
      color: '#eae9ee',
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    group.add(mesh)

    // 三角锥
    const coneGeometry = new THREE.ConeGeometry(100, 300, 4, 1, true)
    const coneMaterial = this.commonFunc.setMaterials({
      transparent: true,
      opacity: 0.8,
      color: '#75a6da'
    })
    const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial)
    coneMesh.position.set(210, 30, 0)
    coneMesh.rotateZ(Math.PI / 2)
    coneMesh.rotateY(Math.PI / 4)
    // 轮廓
    const edges = new THREE.EdgesGeometry(coneGeometry)
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: '#75a6da'
      })
    )
    line.position.set(210, 30, 0)
    line.rotateZ(Math.PI / 2)
    line.rotateY(Math.PI / 4)

    // 监视器摄像头
    const camera = new THREE.PerspectiveCamera(-300, 1, 1, 4000)
    camera.position.set(400, 70, 0)
    camera.lookAt(600, 70, 0)
    group.add(camera)
    // var helper = new THREE.CameraHelper(camera)
    this.monitorCamera.push(camera)
    // group.add(helper)

    // 监视器渲染
    const render = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    render.setSize(180, 200)
    document.querySelector(`#${id}`) &&
      document.querySelector(`#${id}`).appendChild(render.domElement)
    this.monitorRender.push(render)

    // 监视器前面的画面
    // const renderCube = new THREE.WebGLRenderTarget(140, 140)
    // const RTscene = new THREE.Scene()
    // this.RTscene.push(RTscene)
    const plane = new THREE.PlaneGeometry(140, 140)
    const texture = new THREE.CanvasTexture(render.domElement)
    const planeMaterial = this.commonFunc.setMaterials({
      map: texture,
      side: THREE.DoubleSide
    })
    const planeMesh = new THREE.Mesh(plane, planeMaterial)
    planeMesh.position.set(360, 30, 0)
    planeMesh.rotateY(Math.PI / 2)
    group.add(planeMesh)

    group.add(line)
    group.add(coneMesh)

    monitor.add(group)
    this.addObject(monitor)
  }
  //* 旋转 监视器
  spinMonitor(value, key, index) {
    const findObj = (name, source = this.sceneObject, result = []) => {
      source.map(item => {
        if (item.name === name) {
          result.push(item)
          return true
        }
        if (item.children && item.children.length) {
          findObj(name, item.children, result)
          return true
        }
      })
      return result
    }
    const objArr = findObj('monitorSpin')
    // 仰角
    if (key === 'elevation') {
      if (objArr.length) {
        objArr[index].rotation.z = Math.sin(value)
        this.timeRender()
      }
    }
    // 转角
    if (key === 'corner') {
      if (objArr.length) {
        objArr[index].rotation.y = value * Math.PI
        this.timeRender()
      }
    }
    // 远近
    if (key === 'distance') {
      if (this.monitorCamera[index]) {
        const num = -300
        this.monitorCamera[index].fov = num - value * 25
        this.monitorCamera[index].updateProjectionMatrix()
        this.timeRender()
      }
    }
  }
  // * 消防箱
  addFireBox(x, y, z) {
    const group = new THREE.Group()
    group.position.set(-1450, 45, 600)
    group.name = 'firebox'
    // 箱体
    const geometry = new THREE.BufferGeometry()
    const w = 70
    const h1 = 130
    const h2 = h1 - 20
    const d = 80

    const bottomH = 0
    const points = new Float32Array([
      // z轴正面 梯形
      w / 2,
      bottomH,
      d / 2,
      -(w / 2),
      bottomH,
      d / 2,
      -(w / 2),
      h1,
      d / 2,

      w / 2,
      bottomH,
      d / 2,
      w / 2,
      h2,
      d / 2,
      -(w / 2),
      h1,
      d / 2,

      // z轴 反面
      w / 2,
      bottomH,
      -d / 2,
      -(w / 2),
      bottomH,
      -d / 2,
      -(w / 2),
      h1,
      -d / 2,

      w / 2,
      bottomH,
      -d / 2,
      w / 2,
      h2,
      -d / 2,
      -(w / 2),
      h1,
      -d / 2,

      // x轴 正面
      w / 2,
      bottomH,
      d / 2,
      w / 2,
      bottomH,
      -d / 2,
      w / 2,
      h2,
      -d / 2,

      w / 2,
      bottomH,
      d / 2,
      w / 2,
      h2,
      -d / 2,
      w / 2,
      h2,
      d / 2,

      // z轴 反面
      -w / 2,
      bottomH,
      d / 2,
      -w / 2,
      bottomH,
      -d / 2,
      -w / 2,
      h1,
      -d / 2,

      -w / 2,
      bottomH,
      d / 2,
      -w / 2,
      h1,
      -d / 2,
      -w / 2,
      h1,
      d / 2,

      // y轴 正面
      w / 2,
      h2,
      d / 2,
      -w / 2,
      h1,
      d / 2,
      -w / 2,
      h1,
      -d / 2,

      w / 2,
      h2,
      d / 2,
      w / 2,
      h2,
      -d / 2,
      -w / 2,
      h1,
      -d / 2,

      // y轴反面
      w / 2,
      bottomH,
      d / 2,
      -w / 2,
      bottomH,
      d / 2,
      -w / 2,
      bottomH,
      -d / 2,

      w / 2,
      bottomH,
      d / 2,
      -w / 2,
      bottomH,
      -d / 2,
      w / 2,
      bottomH,
      -d / 2
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
    const material = this.commonFunc.setMaterials({
      side: THREE.DoubleSide,
      color: '#a51717'
    })
    const mesh = new THREE.Mesh(geometry, material)
    group.add(mesh)

    // 顶部盖子
    const cube = this.initCube({
      width: w + 10,
      height: 5,
      depth: d + 10,
      x: 0,
      y: h1 - 10,
      z: 0,
      skin: {
        color: '#a51717'
      },
      rotate: {
        z: -Math.PI / 10
      }
    })
    group.add(cube)

    // 前面的两块 贴图
    const cube1 = this.initCube({
      width: 5,
      height: h2 / 2 - 10,
      depth: d - 10,
      x: w / 2 + 2,
      y: h2 - h2 / 2 / 2,
      z: 0,
      skin: {
        color: '#a51717',
        img: require('@/assets/images/fire1.png')
      }
    })
    group.add(cube1)

    const cube2 = this.initCube({
      width: 5,
      height: h2 / 2 - 10,
      depth: d - 10,
      x: w / 2 + 2,
      y: h2 / 4,
      z: 0,
      skin: {
        color: '#a51717',
        img: require('@/assets/images/fire2.png')
      }
    })
    group.add(cube2)

    // 四个脚
    const legW = 10
    const legH = 20
    const legD = 10

    const arr = [{
      x: w / 2 - 10,
      z: d / 2 - 10,
      rotate: {
        y: Math.PI
      }
    },
    {
      x: -w / 2 + 10,
      z: d / 2 - 10
    },
    {
      x: w / 2 - 10,
      z: -d / 2 + 10,
      rotate: {
        y: Math.PI
      }
    },
    {
      x: -w / 2 + 10,
      z: -d / 2 + 10
    }
    ]
    arr.forEach(item => {
      const legGroup = new THREE.Group()
      legGroup.position.set(item.x, -legH, item.z)
      item.rotate && this.commonFunc.setRotate(legGroup, item.rotate)
      const legGeometry = new THREE.BufferGeometry()
      const legPoints = new Float32Array([
        // z轴 正面
        -legW / 2,
        0,
        legD / 2,
        -legW / 2,
        legH,
        legD / 2,
        legW / 2 + 10,
        legH,
        legD / 2,

        -legW / 2,
        0,
        legD / 2,
        legW / 2 + 10,
        legH,
        legD / 2,
        legW / 2,
        0,
        legD / 2,

        // z轴 反面
        -legW / 2,
        0,
        -legD / 2,
        -legW / 2,
        legH,
        -legD / 2,
        legW / 2 + 10,
        legH,
        -legD / 2,

        -legW / 2,
        0,
        -legD / 2,
        legW / 2 + 10,
        legH,
        -legD / 2,
        legW / 2,
        0,
        -legD / 2,

        // y轴 正面
        -legW / 2,
        legH,
        legD / 2,
        -legW / 2,
        legH,
        -legD / 2,
        legW / 2 + 10,
        legH,
        -legD / 2,

        -legW / 2,
        legH,
        legD / 2,
        legW / 2 + 10,
        legH,
        -legD / 2,
        legW / 2 + 10,
        legH,
        legD / 2,

        // y轴 反面
        -legW / 2,
        0,
        legD / 2,
        -legW / 2,
        0,
        -legD / 2,
        legW / 2,
        0,
        -legD / 2,

        -legW / 2,
        0,
        legD / 2,
        legW / 2,
        0,
        -legD / 2,
        legW / 2,
        0,
        legD / 2,

        // x轴 正面
        legW / 2,
        0,
        legD / 2,
        legW / 2 + 10,
        legH,
        legD / 2,
        legW / 2 + 10,
        legH,
        -legD / 2,

        legW / 2,
        0,
        legD / 2,
        legW / 2 + 10,
        legH,
        -legD / 2,
        legW / 2,
        0,
        -legD / 2,
        // x轴 反面
        -legW / 2,
        0,
        legD / 2,
        -legW / 2,
        0,
        -legD / 2,
        -legW / 2,
        legH,
        -legD / 2,

        -legW / 2,
        0,
        legD / 2,
        -legW / 2,
        legH,
        -legD / 2,
        -legW / 2,
        legH,
        legD / 2
      ])

      legGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(legPoints, 3)
      )
      const material1 = this.commonFunc.setMaterials({
        side: THREE.DoubleSide,
        color: '#a51717'
      })
      const mesh1 = new THREE.Mesh(legGeometry, material1)
      legGroup.add(mesh1)

      group.add(legGroup)
    })

    this.addObject(group)
  }
  //* 生成椅子
  setChairAndSofa() {
    this.initGLTF({
      x: -600,
      y: 160,
      z: 1500,
      name: 'chair',
      rotate: {
        x: -Math.PI / 2
      },
      loadEndFn: (obj) => {
        const arr = [
          {
            x: -200,
            z: 1500
          },
          {
            x: 0,
            z: -1400,
            rotate: {
              z: Math.PI
            }
          },
          {
            x: 400,
            z: -1400,
            rotate: {
              z: Math.PI
            }
          },
          {
            x: 800,
            z: -1400,
            rotate: {
              z: Math.PI
            }
          }
        ]
        arr.forEach(item => {
          const mesh1 = obj.clone()
          mesh1.position.set(item.x, 160, item.z)
          item.rotate && this.commonFunc.setRotate(mesh1, item.rotate)
          this.addObject(mesh1)
        })
      },
      gltfImg: '/chair/chair2.gltf'
    })

    this.initObjLoader({
      name: 'sofa',
      x: 2500,
      y: 0,
      z: -1850,
      objImg: '/sofa/sofa.obj',
      mtlImg: '/sofa/sofa.mtl',
      scale: {
        x: 8,
        y: 8,
        z: 6
      }
    })

    // this.initGLTF({
    //   name: 'sofa',
    //   x: 2500,
    //   y: 150,
    //   z: -1850,
    //   gltfImg: '/sofa/sofa2.gltf',
    //   scale: {
    //     x: 8,
    //     y: 8,
    //     z: 6
    //   }
    // })
  }
}
