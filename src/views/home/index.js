/*
 * @Author: E-Dreamer
 * @Date: 2021-10-14 15:44:04
 * @LastEditTime: 2021-10-15 10:36:10
 * @LastEditors: E-Dreamer
 * @Description:
 */
import Mjs3d from '@/threejs'
import * as THREE from 'three'
export default class Homes extends Mjs3d {
  constructor(...args) {
    super(...args)
    this.usage = false
  }
  setTables() {
    const group = this.initGroup({
      name: '桌子',
      x: -2700,
      y: 11,
      z: 200
    })
    const roundedRectShape = new THREE.Shape()
    function roundedRect(ctx, x, y, width, height, radius) {
      ctx.moveTo(x, y + radius)
      ctx.lineTo(x, y + height - radius)
      ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
      ctx.lineTo(x + width - radius, y + height)
      ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
      ctx.lineTo(x + width, y + radius)
      ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
      ctx.lineTo(x + radius, y)
      ctx.quadraticCurveTo(x, y, x, y + radius)
    }
    roundedRect(roundedRectShape, 0, 0, 200, 50, 20)

    const path = new THREE.Path()
    roundedRect(path, 0, 0, 200, 50, 20)

    // 中间需要掏空的
    roundedRectShape.holes.push(path)
    const shape = new THREE.ExtrudeGeometry(roundedRectShape, { depth: 600, bevelEnabled: true })
    const mesh = new THREE.Mesh(shape, this.commonFunc.setMaterials({
      side: THREE.DoubleSide,
      color: '#f3f3f3'
    }))
    mesh.position.set(-100, 203, -300)
    group.add(mesh)

    for (let i = 0; i < 4; i++) {
      const mesh = this.initCylinder({
        uuid: '',
        name: 'table',
        type: 'cylinder',
        width: 10,
        height: 5,
        depth: 200,
        x: (i % 2 === 0) ? -90 : 90,
        y: 100,
        z: (i === 1 || i === 2) ? -290 : 290,
        skin: {
          color: '#c2815e'
        },
        rotate: {
          z: (i % 2 === 1) ? Math.PI / 18 : -Math.PI / 18
        }
      })
      group.add(mesh)
    }
    const cube = this.initCube({
      uuid: '',
      type: 'cube',
      name: 'carpet',
      width: 600,
      depth: 800,
      height: 2,
      x: 0,
      y: 0,
      z: 0,
      skin: {
        color: '#000'
      }
    })
    group.add(cube)

    this.addObject(group)
  }
  /**
   * @description: 展示容量
   * @param {*} name 机柜的名称
   * @return {*}
   */
  addUsage(name) {
    if (!this.usage) {
      this.usage = true
      let parentGroup

      const findNameObj = (arr) => {
        arr.map(item => {
          if (item.name.includes(name)) {
            // item.children.length = 6 的时候 是创建的机柜 原本的组
            if (item.type === 'Group' && item.children.length > 6) {
              // 组的情况就要在group.children中找 制定的物体
              // parentGroup = this.commonFunc.cloneObj(item)
              // parentGroup.children = []
              parentGroup = this.initGroup({
                name: 'usage',
                x: item.position.x,
                y: item.position.y,
                z: item.position.z
              })
              findNameObj(item.children)
              return
            }
            let width, height, depth
            if (item.children && item.children.length) {
              // up y轴正方形的  front z轴 正方形
              // 从up 中获取  depth
              // 从front中获取 height
              // width 两个中都可以获取到
              const upMesh = item.children[0]
              const Front = item.children[5]

              width = upMesh.geometry && upMesh.geometry.parameters.width
              depth = upMesh.geometry && upMesh.geometry.parameters.depth
              height = Front.geometry && Front.geometry.parameters.height
            }

            this.setEsg(width, height, depth, item, parentGroup)
          }
        })
      }
      findNameObj(this.scene.children)

      // 获取机柜列表 并移除
      const arr = this.objects.filter(item => item.name === name)
      arr && arr.length && arr.forEach(item => {
        this.removeObject(item.name)
      })
    } else {
      this.restore('usage')
    }
  }
  // *点击之前还原
  restore(name) {
    if (name === 'usage') {
      if (this.usage) {
        // 移除当前生成的元素
        this.removeObject('usage')
        // 创建机柜
        const arr = this.objects.filter(item => item.name === 'cabinet')
        arr.forEach(item => {
          this.createObject(item)
        })
        this.usage = false
      }
    }
  }
}
