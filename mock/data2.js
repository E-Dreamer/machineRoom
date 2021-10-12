const {
  deepClone
} = require('./utils')

/*
 * @Author: E-Dreamer
 * @Date: 2021-10-08 10:26:52
 * @LastEditTime: 2021-10-12 09:12:42
 * @LastEditors: E-Dreamer
 * @Description:
 */
const floor = {
  uuid: '',
  name: 'floor',
  type: 'cube',
  width: 6000,
  height: 50,
  depth: 4000,
  x: 0,
  y: 0,
  z: 0,
  skin: {
    color: '#607bb6',
    skinUp: {
      img: 'floor2.png',
      repeatx: true,
      repeatz: true,
      RX: 105,
      RZ: 105
    }
  }
}

const allObj = {
  uuid: '',
  name: 'all',
  x: -3000,
  z: -2000,
  y: 0,
  type: 'group',
  children: []
}
const wall = {
  uuid: '',
  name: 'wall',
  x: 0,
  z: 0,
  y: 0,
  type: 'group',
  children: []
}
const plane = [{
  uuid: '',
  type: 'cube',
  name: 'plane',
  width: 5,
  height: 400,
  depth: 400,
  x: 100,
  y: 300,
  z: 2000,
  skin: {
    img: 'warning.png'
  }
},
{
  uuid: '',
  type: 'cube',
  name: 'plane',
  width: 5,
  height: 400,
  depth: 400,
  x: 5950,
  y: 300,
  z: 700,
  skin: {
    img: 'warning.png'
  }
}
]
const wallArr = [
  // 左侧两个墙
  {
    x: 5,
    y: 275,
    z: 850,
    width: 10,
    depth: 1700
  },
  {
    x: 5,
    y: 275,
    z: 3150,
    width: 10,
    depth: 1700
  },
  {
    x: 55,
    y: 275,
    z: 1700,
    width: 100,
    depth: 10
  },
  {
    x: 55,
    y: 275,
    z: 2300,
    width: 100,
    depth: 10
  },
  {
    x: 3000,
    y: 275,
    z: 5,
    width: 6000,
    depth: 10
  },
  {
    x: 5995,
    y: 275,
    z: 200,
    width: 10,
    depth: 400
  },
  {
    x: 5995,
    y: 275,
    z: 1600,
    width: 10,
    depth: 1200
  },
  {
    x: 1750,
    y: 275,
    z: 4000,
    width: 3500,
    depth: 10
  }
]
wallArr.forEach(item => {
  wall.children.push({
    uuid: '',
    name: 'wall',
    type: 'cube',
    x: item.x,
    y: item.y,
    z: item.z,
    width: item.width,
    depth: item.depth,
    height: 500,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  })
})

// 柱子
const pillar = [{
  uuid: '',
  name: 'pillar',
  type: 'cube',
  width: 100,
  height: 600,
  depth: 100,
  x: 6000,
  y: 320,
  // z: 2050,
  z: 2200,
  skin: {
    img: 'wall.png',
    skinUp: {
      color: '#fff'
    },
    skinBottom: {
      color: '#fff'
    }
  }
},
{
  uuid: '',
  name: 'pillar',
  type: 'cube',
  width: 100,
  height: 600,
  depth: 100,
  x: 3500,
  y: 320,
  z: 4000,
  skin: {
    img: 'wall.png',
    skinUp: {
      color: '#fff'
    },
    skinBottom: {
      color: '#fff'
    }
  }
}
]
// 底部有墙的玻璃
const bottomAndGlass = [{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    type: 'cube',
    width: 20,
    height: 40,
    depth: 1800,
    x: 6000,
    y: 40,
    z: 3100,
    skin: {
      color: '#fff'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 10,
    height: 400,
    depth: 1800,
    x: 5995,
    y: 200,
    z: 3100,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    type: 'cube',
    width: 2500,
    height: 40,
    depth: 20,
    x: 4750,
    y: 40,
    z: 4000,
    skin: {
      color: '#fff'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 2500,
    height: 400,
    depth: 10,
    x: 4750,
    y: 200,
    z: 3995,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
// 有屏幕的房间 里面的墙
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 200,
    height: 40,
    depth: 20,
    x: 2300,
    y: 30,
    z: 800,
    skin: {
      color: '#4d4d4d'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 200,
    height: 300,
    depth: 20,
    x: 2300,
    y: 180,
    z: 800,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 1200,
    height: 40,
    depth: 20,
    x: 3400,
    y: 30,
    z: 800,
    skin: {
      color: '#4d4d4d'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 1200,
    height: 300,
    depth: 20,
    x: 3400,
    y: 180,
    z: 800,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 20,
    height: 40,
    depth: 200,
    x: 4000,
    y: 30,
    z: 700,
    skin: {
      color: '#4d4d4d'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 20,
    height: 300,
    depth: 200,
    x: 4000,
    y: 180,
    z: 700,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 100,
    height: 40,
    depth: 20,
    x: 2000,
    y: 30,
    z: 2500,
    skin: {
      color: '#4d4d4d'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 100,
    height: 500,
    depth: 10,
    x: 2000,
    y: 250,
    z: 2500,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 20,
    height: 40,
    depth: 800,
    x: 2050,
    y: 30,
    z: 2100,
    skin: {
      color: '#4d4d4d'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 20,
    height: 500,
    depth: 800,
    x: 2050,
    y: 250,
    z: 2100,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 3950,
    height: 40,
    depth: 20,
    x: 4025,
    y: 30,
    z: 1700,
    skin: {
      color: '#4d4d4d'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 3950,
    height: 500,
    depth: 20,
    x: 4025,
    y: 250,
    z: 1700,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 100,
    height: 40,
    depth: 20,
    x: 1550,
    y: 30,
    z: 3200,
    skin: {
      color: '#fff'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 100,
    height: 500,
    depth: 20,
    x: 1550,
    y: 250,
    z: 3200,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 1400,
    height: 40,
    depth: 20,
    x: 2800,
    y: 30,
    z: 3200,
    skin: {
      color: '#fff'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 1400,
    height: 400,
    depth: 20,
    x: 2800,
    y: 250,
    z: 3200,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
},
{
  uuid: '',
  type: 'group',
  name: 'wall',
  x: 0,
  y: 0,
  z: 0,
  children: [{
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 10,
    height: 40,
    depth: 800,
    x: 3500,
    y: 30,
    z: 3600,
    skin: {
      color: '#fff'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 10,
    height: 400,
    depth: 800,
    x: 3500,
    y: 250,
    z: 3600,
    skin: {
      color: '#517fb4',
      transparent: true,
      opacity: 0.3
    }
  }
  ]
}
]

// 内部的墙
const insideWall = [{
  uuid: '',
  type: 'merge',
  name: 'wall',
  parent: {
    type: 'cube',
    name: 'wall',
    width: 700,
    height: 500,
    depth: 20,
    x: 1850,
    y: 250,
    z: 800,
    skin: {
      img: 'wall.png'
    }
  },
  mergeChild: [{
    op: '-',
    type: 'cube',
    width: 300,
    height: 500,
    depth: 20,
    x: 1750,
    y: 250,
    z: 800,
    skin: {
      img: 'wall.png'
    }
  }]
}]

const insideWallArr = [{
  width: 20,
  depth: 800,
  x: 1500,
  z: 400
},
{
  width: 20,
  depth: 800,
  x: 2200,
  z: 400
},
{
  width: 20,
  depth: 800,
  x: 5000,
  z: 400
},
// 有屏幕的墙
{
  width: 2800,
  depth: 20,
  x: 3600,
  z: 12
},
{
  width: 300,
  depth: 20,
  x: 4850,
  z: 800
},
{
  width: 20,
  depth: 1500,
  x: 1500,
  z: 3250
},
{
  width: 100,
  depth: 20,
  x: 1550,
  z: 2500
}
]
insideWallArr.forEach(item => {
  insideWall.push({
    uuid: '',
    type: 'cube',
    name: 'wall',
    width: item.width,
    height: 500,
    depth: item.depth,
    x: item.x,
    y: 250,
    z: item.z,
    skin: {
      img: 'wall.png'
    }
  })
})

// 屏幕
const television = [{
  uuid: '',
  type: 'cube',
  name: 'television',
  width: 1200,
  height: 400,
  depth: 10,
  x: 3400,
  y: 300,
  z: 22,
  skin: {
    img: 'scene.png'
  }
},
{
  uuid: '',
  type: 'cube',
  name: 'television',
  width: 1000,
  height: 400,
  depth: 10,
  x: 2600,
  y: 300,
  z: 3980,
  skin: {
    img: 'scene.png'
  }
}
]
// 单独的桌子
const aloneTable = {
  uuid: '',
  type: 'group',
  name: 'table',
  x: 0,
  y: 25,
  z: 0,
  children: [{
    uuid: '',
    type: 'cube',
    name: 'table',
    width: 400,
    height: 20,
    depth: 200,
    x: 0,
    y: 150,
    z: 0,
    skin: {
      color: '',
      img: 'table.png'
    }
  },
  {
    uuid: '',
    type: 'merge',
    parent: {
      uuid: '',
      name: 'table',
      type: 'cube',
      width: 20,
      height: 130,
      depth: 200,
      x: -180,
      y: 75,
      z: 0,
      skin: {
        color: '#7c7875'
      }
    },
    mergeChild: [{
      uuid: '',
      type: 'cube',
      op: '-',
      width: 20,
      height: 110,
      depth: 180,
      x: -180,
      y: 75,
      z: 0
    }]
  },
  {
    uuid: '',
    type: 'merge',
    parent: {
      uuid: '',
      name: 'table',
      type: 'cube',
      width: 20,
      height: 130,
      depth: 200,
      x: 180,
      y: 75,
      z: 0,
      skin: {
        color: '#7c7875'
      }
    },
    mergeChild: [{
      uuid: '',
      type: 'cube',
      op: '-',
      width: 20,
      height: 110,
      depth: 180,
      x: 180,
      y: 75,
      z: 0
    }]
  }
  ]
}
// 单独的电脑
const aloneComputer = {
  uuid: '',
  name: 'computer',
  type: 'group',
  x: 3400,
  y: 190,
  z: 350,
  children: [
    {
      uuid: '',
      type: 'cube',
      width: 160,
      height: 5,
      depth: 90,
      x: 0,
      y: 0,
      z: 0,
      skin: {
        color: '#d2d6da',
        skinUp: {
          img: 'computer.png'
        }
      }
    },
    {
      uuid: '',
      type: 'cube',
      width: 160,
      depth: 5,
      height: 90,
      x: 0,
      y: 45,
      z: -55,
      skin: {
        color: '#d2d6da',
        skinRight: {
          img: 'computer1.jpg'
        }
      },
      rotate: {
        x: -Math.PI / 18
      }
    }
  ]
}
// 桌子和电脑
const table = [

]
for (let i = 0; i < 3; i++) {
  const x = [3000, 3400, 3800]
  const clone = deepClone(aloneTable)
  clone.x = x[i]
  clone.z = 350
  const cloneCom = deepClone(aloneComputer)
  cloneCom.x = x[i]
  cloneCom.z = 350
  table.push(clone)
  table.push(cloneCom)
}
for (let i = 0; i < 2; i++) {
  const clone = deepClone(aloneTable)
  clone.x = [2800, 2400][i]
  clone.z = 3700
  const cloneCom = deepClone(aloneComputer)
  cloneCom.x = 2800
  cloneCom.z = 3700
  cloneCom.rotate = {
    y: Math.PI
  }
  table.push(clone)
  table.push(cloneCom)
}
// 机柜旁边的玻璃
const glassDoor = {
  uuid: '',
  type: 'group',
  name: 'glassDoor',
  x: 0,
  y: 0,
  z: 0,
  children: [

  ]
}

const cabinet = {
  uuid: '',
  type: 'group',
  name: 'cabinet_twopage',
  x: 0,
  y: 0,
  z: 0,
  children: []
}
const glassDoorArr = [{
  parent: {
    width: 150,
    height: 400,
    depth: 10,
    x: 0,
    y: 200,
    z: 0
  },
  mergeChild: {
    width: 130,
    height: 380,
    depth: 10,
    x: 0,
    y: 200,
    z: 0
  }
},
{
  parent: {
    width: 150,
    height: 400,
    depth: 10,
    x: 150,
    y: 200,
    z: 0
  },
  mergeChild: {
    width: 130,
    height: 380,
    depth: 10,
    x: 150,
    y: 200,
    z: 0
  }
},
{
  parent: {
    width: 150,
    height: 400,
    depth: 10,
    x: 0,
    y: 200,
    z: -1200
  },
  mergeChild: {
    width: 130,
    height: 380,
    depth: 10,
    x: 0,
    y: 200,
    z: -1200
  }
},
{
  parent: {
    width: 150,
    height: 400,
    depth: 10,
    x: 150,
    y: 200,
    z: -1200
  },
  mergeChild: {
    width: 130,
    height: 380,
    depth: 10,
    x: 150,
    y: 200,
    z: -1200
  }
}
]
for (let i = 0; i < 8; i++) {
  glassDoorArr.push({
    parent: {
      width: 300,
      height: 10,
      depth: 150,
      x: 75,
      y: 400,
      z: -1125 + i * 150
    },
    mergeChild: {
      width: 280,
      height: 10,
      depth: 130,
      x: 75,
      y: 400,
      z: -1125 + i * 150
    }
  })
}

function getSkin(i, j) {
  return {
    front: {
      color: i === 1 && j === 1 ? '#854c4c' : i === 4 ? '#afb0b0' : '#fff',
      transparent: i === 1 && j === 1,
      opacity: i === 1 && j === 1 ? 0.2 : null,
      img: i !== 4 && 'cabinet1_arrow.jpg'
    },
    up: {
      color: i === 1 && j === 1 ? '#854c4c' : i === 4 ? '#afb0b0' : '#000',
      transparent: i === 1 && j === 1,
      opacity: i === 1 && j === 1 ? 0.2 : null,
      img: i === 4 && j === 0 ? 'cabinet2_top.png' : null
    },
    bottom: {
      color: i === 1 && j === 1 ? '#854c4c' : i === 4 ? '#afb0b0' : '#000',
      transparent: i === 1 && j === 1,
      opacity: i === 1 && j === 1 ? 0.2 : null
    },
    back: {
      color: i === 1 && j === 1 ? '#854c4c' : i === 4 ? '#afb0b0' : '#fff',
      transparent: i === 1 && j === 1,
      opacity: i === 1 && j === 1 ? 0.2 : null,
      img: i !== 4 && 'cabinet1_arrow.jpg'
    },
    right: {
      color: i === 1 && j === 1 ? '#854c4c' : i === 4 ? '#afb0b0' : '#fff',
      transparent: i === 1 && j === 1,
      opacity: i === 1 && j === 1 ? 0.2 : null,
      img: function() {
        if (i !== 4) {
          if (j === 1) {
            return 'cabinet1_arrow.jpg'
          }
          return 'cabinet1.png'
        }
        if (i === 4 && j === 0) {
          return 'cabinet2.png'
        }
      }
    },
    left: {
      color: i === 1 && j === 1 ? '#854c4c' : i === 4 ? '#afb0b0' : '#fff',
      transparent: i === 1 && j === 1,
      opacity: i === 1 && j === 1 ? 0.2 : null,
      img: function() {
        if (i !== 4) {
          if (j === 0) {
            return 'cabinet1_arrow.jpg'
          }
          return 'cabinet1.png'
        }
        if (i === 4) {
          return j === 1 ? '2.png' : 'cabinet2.png'
        }
      }
    }
  }
}
// 左侧的机柜
for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 2; j++) {
    cabinet.children.push({
      uuid: '',
      type: 'cabinet',
      name: 'cabinet_twopage',
      width: 150,
      height: 400,
      depth: 150,
      doorDiraction: 'left',
      doorName: 'cabinet_twopagedoor',
      x: j === 0 ? 120 : -50,
      y: 0,
      z: -562 + i * 75,
      skin: getSkin(i, j)
    })
  }
}
glassDoorArr.forEach(item => {
  // 掏空的门框
  glassDoor.children.push({
    uuid: '',
    type: 'merge',
    parent: {
      uuid: '',
      type: 'cube',
      name: 'glassDoor',
      width: item.parent.width,
      height: item.parent.height,
      depth: item.parent.depth,
      x: item.parent.x,
      y: item.parent.y,
      z: item.parent.z,
      skin: {
        color: '#000'
      }
    },
    mergeChild: [{
      op: '-',
      type: 'cube',
      width: item.mergeChild.width,
      height: item.mergeChild.height,
      depth: item.mergeChild.depth,
      x: item.mergeChild.x,
      y: item.mergeChild.y,
      z: item.mergeChild.z
    }]
  })
  glassDoor.children.push({
    uuid: '',
    type: 'cube',
    name: 'glassDoor',
    width: item.mergeChild.width,
    height: item.mergeChild.height,
    depth: item.mergeChild.depth,
    x: item.mergeChild.x,
    y: item.mergeChild.y,
    z: item.mergeChild.z,
    skin: {
      transparent: true,
      opacity: 0.4,
      color: '#60a5ec'
    }
  })
})

const glassDoorAndCabinet = {
  uuid: '',
  type: 'group',
  name: 'glassDoorAndCabinet',
  x: 600,
  y: 25,
  z: 3800,
  children: [
    glassDoor,
    cabinet
  ]
}

const glassDoorAndCabinet1 = deepClone(glassDoorAndCabinet)
glassDoorAndCabinet1.x = 4000
glassDoorAndCabinet1.name = 'glassDoorAndCabinet1'

const glassDoorAndCabinet2 = deepClone(glassDoorAndCabinet)
glassDoorAndCabinet2.x = 5000
glassDoorAndCabinet2.name = 'glassDoorAndCabinet2'

// 保密柜
const Confidential = []

const confidentialArr = [
  {
    x: 5800,
    z: 2000
  },
  {
    x: 2500,
    z: 1900,
    rotate: {
      y: Math.PI / 2
    }
  },
  {
    x: 2300,
    z: 1900,
    rotate: {
      y: Math.PI / 2
    }
  },
  {
    x: 1600,
    z: 3800,
    rotate: {
      y: Math.PI
    }
  }
]
confidentialArr.forEach(item => {
  Confidential.push({
    uuid: '',
    type: 'cube',
    width: 200,
    height: 450,
    depth: 200,
    x: item.x,
    y: 250,
    z: item.z,
    skin: {
      color: '#c3c5c4',
      skinFront: {
        img: 'cabinet3.png'
      }
    },
    rotate: item.rotate || null
  })
})

// 电箱
const electricity = []
const elertricityArr = [
  {
    x: 1600,
    z: 3580
  },
  {
    x: 1600,
    z: 3350
  }
]
elertricityArr.forEach(item => {
  electricity.push({
    uuid: '',
    name: 'electricity',
    type: 'cube',
    width: 200,
    height: 450,
    depth: 200,
    x: item.x,
    y: 250,
    z: item.z,
    skin: {
      color: '#c3c5c4',
      skinUp: {
        img: 'cabinet2_top.png'
      },
      skinBack: {
        img: 'cabinet2.png'
      }
    }
  })
})

// 电源控制开关
const power = {
  uuid: '',
  type: 'cube',
  name: 'power',
  width: 100,
  height: 300,
  depth: 200,
  x: 1600,
  z: 3000,
  y: 300,
  skin: {
    color: '#cccccc',
    skinBack: {
      img: 'cabinet4.png'
    }
  }
}

const teaTable = {
  uuid: '',
  name: 'teaTable',
  type: 'group',
  x: 5300,
  y: 0,
  z: 400,
  children: [
    {
      uuid: '',
      name: 'teaTable',
      type: 'cube',
      width: 200,
      height: 20,
      depth: 100,
      x: 0,
      y: 170,
      z: 0,
      skin: {
        img: 'teatable.png'
      }
    },
    {
      uuid: '',
      type: 'cube',
      width: 10,
      height: 10,
      depth: 100,
      x: 90,
      y: 160,
      z: 0,
      skin: {
        color: '#dfb397'
      }
    },
    {
      uuid: '',
      type: 'cube',
      width: 10,
      height: 10,
      depth: 100,
      x: -90,
      y: 160,
      z: 0,
      skin: {
        color: '#dfb397'
      }
    }
  ]
}

const teaTableLeg = [
  {
    parent: {
      width: 200,
      height: 125,
      depth: 10,
      x: 0,
      y: 100,
      z: -45
    },
    mergeChild: {
      width: 180,
      height: 115,
      depth: 10,
      x: 0,
      y: 90,
      z: -45
    }
  },
  {
    parent: {
      width: 200,
      height: 125,
      depth: 10,
      x: 0,
      y: 100,
      z: 45
    },
    mergeChild: {
      width: 180,
      height: 115,
      depth: 10,
      x: 0,
      y: 90,
      z: 45
    }
  }
]
teaTableLeg.forEach(item => {
  teaTable.children.push({
    uuid: '',
    type: 'merge',
    parent: {
      uuid: '',
      name: 'teaTable',
      type: 'cube',
      width: item.parent.width,
      height: item.parent.height,
      depth: item.parent.depth,
      x: item.parent.x,
      y: item.parent.y,
      z: item.parent.z,
      skin: {
        color: '#dfb397'
      }
    },
    mergeChild: [
      {
        uuid: '',
        op: '-',
        type: 'cube',
        width: item.mergeChild.width,
        height: item.mergeChild.height,
        depth: item.mergeChild.depth,
        x: item.mergeChild.x,
        y: item.mergeChild.y,
        z: item.mergeChild.z
      }
    ]
  })
})

const teaTable2 = deepClone(teaTable)
teaTable2.x = 5700

// 监视器
const monitor = [
  {
    uuid: '',
    name: 'monitor',
    type: 'group',
    x: 10,
    y: 300,
    z: 100,
    children: [
      {
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
]
allObj.children = [
  wall,
  ...pillar,
  ...bottomAndGlass,
  ...insideWall,
  ...television,
  ...plane,
  glassDoorAndCabinet,
  glassDoorAndCabinet1,
  glassDoorAndCabinet2,
  ...table,
  ...Confidential,
  ...electricity,
  power,
  teaTable,
  teaTable2,
  ...monitor
]

// 机箱
const air = [{
  uuid: '',
  type: 'group',
  name: 'air',
  x: -2300,
  y: 0,
  z: 2200,
  children: [{
    uuid: '',
    type: 'cube',
    width: 300,
    height: 300,
    depth: 200,
    x: 0,
    y: 180,
    z: 0,
    skin: {
      color: '#fff',
      skinRight: {
        img: 'air1.png'
      },
      skinLeft: {
        img: 'air1.png'
      },
      skinFront: {
        img: 'air2.png'
      },
      skinBack: {
        img: 'air3.png'
      }
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 100,
    height: 5,
    depth: 100,
    x: -50,
    y: 330,
    z: 0,
    skin: {
      color: '#000'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 100,
    height: 5,
    depth: 100,
    x: 60,
    y: 330,
    z: 0,
    skin: {
      color: '#000'
    }
  },
  {
    uuid: '',
    type: 'cylinder',
    width: 50,
    depth: 40,
    height: 50,
    x: -50,
    z: 0,
    y: 345,
    skin: {
      color: '#fff',
      img: 'air4.png'
    }
  },
  {
    uuid: '',
    type: 'cylinder',
    width: 50,
    depth: 40,
    height: 50,
    x: 60,
    z: 0,
    y: 345,
    skin: {
      color: '#fff',
      img: 'air4.png'
    }
  }
  ]
}, {
  uuid: '',
  type: 'group',
  name: 'air',
  x: 3200,
  y: 0,
  z: -100,
  rotate: {
    y: -Math.PI / 2
  },
  children: [{
    uuid: '',
    type: 'cube',
    width: 300,
    height: 300,
    depth: 200,
    x: 0,
    y: 180,
    z: 0,
    skin: {
      color: '#fff',
      skinLeft: {
        img: 'air1.png'
      },
      skinRight: {
        img: 'air1.png'
      },
      skinBack: {
        img: 'air2.png'
      },
      skinFront: {
        img: 'air3.png'
      }
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 100,
    height: 5,
    depth: 100,
    x: -50,
    y: 330,
    z: 0,
    skin: {
      color: '#000'
    }
  },
  {
    uuid: '',
    type: 'cube',
    width: 100,
    height: 5,
    depth: 100,
    x: 60,
    y: 330,
    z: 0,
    skin: {
      color: '#000'
    }
  },
  {
    uuid: '',
    type: 'cylinder',
    width: 50,
    depth: 40,
    height: 50,
    x: -50,
    z: 0,
    y: 345,
    skin: {
      color: '#fff',
      img: 'air4.png'
    }
  },
  {
    uuid: '',
    type: 'cylinder',
    width: 50,
    depth: 40,
    height: 50,
    x: 60,
    z: 0,
    y: 345,
    skin: {
      color: '#fff',
      img: 'air4.png'
    }
  }
  ]
}]
// air 四个垫子和四个脚
const leg = [{
  width: 80,
  depth: 20,
  height: 10,
  x: 110,
  y: 0,
  z: 100
},
{
  width: 80,
  depth: 20,
  height: 10,
  x: -110,
  y: 0,
  z: 100
},
{
  width: 80,
  depth: 20,
  height: 10,
  x: 110,
  y: 0,
  z: -100
},
{
  width: 80,
  depth: 20,
  height: 10,
  x: -110,
  y: 0,
  z: -100
},
{
  width: 60,
  height: 30,
  depth: 20,
  x: 110,
  y: 15,
  z: 100
},
{
  width: 60,
  height: 30,
  depth: 20,
  x: -110,
  y: 15,
  z: 100
},
{
  width: 60,
  height: 30,
  depth: 20,
  x: 110,
  y: 15,
  z: -100
},
{
  width: 60,
  height: 30,
  depth: 20,
  x: -110,
  y: 15,
  z: -100
}
]
leg.forEach(item => {
  air.forEach(el => {
    el.children.push({
      uuid: '',
      type: 'cube',
      width: item.width,
      depth: item.depth,
      height: item.height,
      x: item.x,
      y: item.y,
      z: item.z,
      skin: {
        color: '#e4e9ec'
      }
    })
  })
})
const data = [floor, allObj, ...air]
module.exports = [{
  url: '/twoSceneData',
  type: 'get',
  response: config => {
    return {
      code: 20000,
      data
    }
  }
}]
