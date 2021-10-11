/*
 * @Author: E-Dreamer
 * @Date: 2021-09-28 10:35:16
 * @LastEditTime: 2021-09-30 14:27:33
 * @LastEditors: E-Dreamer
 * @Description:
 */
//* 白墙
const whiteWall = [
  {
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: 1440,
    height: 600,
    depth: 5,
    x: 780,
    y: 500,
    z: 55,
    skin: {
      color: '#fff'
    }
  },
  {
    uuid: '',
    name: 'table',
    type: 'cube',
    width: 1440,
    height: 20,
    depth: 150,
    x: 780,
    y: 190,
    z: 125,
    skin: {
      color: '#fff'
    }
  }
]
//* 需要掏空的墙
const mergeWall = [
  // 窗户墙
  {
    uuid: '',
    type: 'merge',
    parent: {
      uuid: '',
      name: 'wall',
      type: 'cube',
      width: 3700,
      height: 800,
      depth: 60,
      x: 3350,
      y: 400,
      z: 1970,
      skin: {
        color: '#676767',
        transparent: true,
        opacity: 0.5
      }
    },
    mergeChild: [{
      type: 'cube',
      op: '-',
      width: 3200,
      height: 600,
      depth: 60,
      x: 3350,
      y: 400,
      z: 1970,
      skin: {
        color: '#8da5b3'
      }
    }]
  },
  // 门 墙
  {
    uuid: '',
    type: 'merge',
    parent: {
      uuid: '',
      name: 'wall',
      type: 'cube',
      width: 800,
      height: 800,
      depth: 60,
      x: 5620,
      y: 400,
      z: 1400,
      skin: {
        color: '#676767',
        transparent: true,
        opacity: 0.5
      }
    },
    mergeChild: [
      {
        type: 'cube',
        op: '-',
        width: 600,
        height: 600,
        depth: 60,
        x: 5620,
        y: 300,
        z: 1400,
        skin: {
          color: '#8da5b3'
        }
      }
    ]
  },
  {
    uuid: '',
    type: 'merge',
    parent: {
      uuid: '',
      name: 'wall',
      type: 'cube',
      width: 10,
      height: 800,
      depth: 2000,
      x: 1500,
      y: 400,
      z: 970,
      skin: {
        color: '#676767',
        transparent: true,
        opacity: 0.5
      }
    },
    mergeChild: [
      {
        type: 'cube',
        op: '-',
        width: 10,
        height: 600,
        depth: 600,
        x: 1500,
        y: 300,
        z: 1600,
        skin: {
          color: '#8da5b3'
        }
      }
    ]
  }
]
//*  柜子
const cabinet = [
  // 底部
  {
    uuid: '',
    type: 'cube',
    name: 'cabinet_bottom',
    width: 1440,
    height: 5,
    depth: 150,
    x: 780,
    y: 0,
    z: 125,
    skin: {
      color: '#000'
    }
  },
  // 背部
  {
    uuid: '',
    type: 'cube',
    name: 'cabinet_bottom',
    width: 1440,
    height: 180,
    depth: 5,
    x: 780,
    y: 90,
    z: 60,
    skin: {
      color: '#c2815e'
    }
  },
  // 左右
  {
    uuid: '',
    type: 'cube',
    name: 'cabinet_bottom',
    width: 5,
    height: 180,
    depth: 130,
    x: 60,
    y: 90,
    z: 120,
    skin: {
      color: '#c2815e'
    }
  },
  {
    uuid: '',
    type: 'cube',
    name: 'cabinet_bottom',
    width: 5,
    height: 180,
    depth: 130,
    x: 1490,
    y: 90,
    z: 120,
    skin: {
      color: '#c2815e'
    }
  }

]
// 前面四个
for (let i = 0; i <= 4; i++) {
  cabinet.push({
    uuid: '',
    type: 'cube',
    name: 'cabinet_door',
    width: 280,
    height: 180,
    depth: 20,
    x: 200 + i * 290,
    y: 90,
    z: 180,
    // bevelSize: 2,
    // bevelThickness: 1,
    skin: {
      color: '#c2815e'
    }
  })
}
//* 桌子
const table = {
  uuid: '',
  type: 'group',
  name: 'table',
  x: 1350,
  y: 1,
  z: 800,
  children: [
    {
      uuid: '',
      type: 'cube',
      name: 'table',
      width: 200,
      depth: 800,
      height: 20,
      x: 0,
      y: 200,
      z: 0,
      skin: {
        color: '#fff'
      }
    },
    {
      uuid: '',
      type: 'cube',
      name: 'table',
      width: 250,
      depth: 850,
      height: 1,
      x: 0,
      y: 10,
      z: 0,
      skin: {
        color: '#000'
      }
    }
  ]
}
for (let i = 1; i <= 4; i++) {
  table.children.push({
    uuid: '',
    name: 'table',
    type: 'cylinder',
    width: 10,
    height: 5,
    depth: 200,
    x: (i % 2 === 0) ? -90 : 90,
    y: 100,
    z: (i === 1 || i === 2) ? -390 : 390,
    skin: {
      color: '#c2815e'
    },
    rotate: {
      z: (i % 2 === 1) ? Math.PI / 18 : -Math.PI / 18
    }
  })
}

// 电脑
const computer = {
  uuid: '',
  type: 'group',
  name: 'computer',
  x: 1350,
  y: 205,
  z: 800,
  children: [
    // 黑底
    {
      uuid: '',
      type: 'cube',
      width: 70,
      height: 5,
      depth: 150,
      x: 50,
      y: 10,
      z: -100,
      skin: {
        color: '#000'
      }
    },
    // 白底
    {
      uuid: '',
      type: 'cube',
      width: 60,
      height: 3,
      depth: 140,
      x: 50,
      y: 8,
      z: -100,
      skin: {
        color: '#fff'
      }
    },
    // 背部支撑架
    {
      uuid: '',
      type: 'cube',
      width: 10,
      height: 100,
      depth: 10,
      x: 60,
      y: 55,
      z: -100
    },
    // 屏幕
    {
      uuid: '',
      type: 'merge',
      parent: {
        uuid: '',
        type: 'cube',
        name: 'computer',
        width: 15,
        height: 200,
        depth: 300,
        x: 50,
        y: 150,
        z: -100,
        skin: {
          color: '#bcbcbc'
        }
      },
      mergeChild: [
        {
          uuid: '',
          type: 'cube',
          op: '-',
          width: 10,
          height: 180,
          depth: 280,
          x: 45,
          y: 150,
          z: -100
        }
      ]
    }
  ]
}
// 电脑
const computArr = []
for (let i = 0; i < 2; i++) {
  const obj = JSON.parse(JSON.stringify(computer))
  i === 0 ? obj.z = 700 : obj.z = 1100
  computArr.push(obj)
}

// 返回的数据
const data = [...whiteWall, ...mergeWall, ...cabinet, table, ...computArr]
const wallArr = [{
  width: 60,
  depth: 500,
  x: 30,
  z: 220
},
{
  width: 1500,
  depth: 60,
  x: 750,
  z: 0
},
{
  width: 4500,
  depth: 60,
  x: 3750,
  z: 400
},
{
  width: 60,
  depth: 1400,
  x: 6000,
  z: 670
},
// 最右侧的门
{
  width: 60,
  depth: 1700,
  x: 6470,
  z: 820
},
{
  width: 500,
  depth: 60,
  x: 6250,
  z: 0
},
{
  width: 60,
  depth: 600,
  x: 5200,
  z: 1670
}
]
wallArr.forEach(item => {
  data.push({
    uuid: '',
    name: 'wall',
    type: 'cube',
    width: item.width,
    height: 800,
    depth: item.depth,
    x: item.x,
    y: 400,
    z: item.z,
    skin: {
      color: '#676767',
      transparent: true,
      opacity: 0.5
    }
  })
})

module.exports = [{
  url: '/oneSceneData',
  type: 'get',
  response: config => {
    return {
      code: 20000,
      data: {
        data
      }
    }
  }
}]
