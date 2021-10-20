/*
 * @Author: E-Dreamer
 * @Date: 2021-10-14 15:44:04
 * @LastEditTime: 2021-10-20 13:19:59
 * @LastEditors: E-Dreamer
 * @Description:
 */
import Mjs3d from '@/threejs'
import * as THREE from 'three'
import mouseEvent from './btn'
export default class Homes extends Mjs3d {
  constructor(...args) {
    super(...args)
    this.usage = false
    this.mouseEventList = mouseEvent
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

    // const leg = this.initTube({
    //   name: 'leg',
    //   pathArr: [
    //     [0, 0, -50],
    //     [0, 100, -50],
    //     [0, 80, -20],
    //     [0, 80, 20],
    //     [0, 100, 50],
    //     [0, 0, 50]
    //   ],
    //   radius: 5,
    //   skin: {
    //     color: '#c2815e'
    //   }
    // })
    // group.add(leg)
    this.addObject(group)
  }
}
