<template>
  <div id="canvas">
    <div class="footer">
      <el-button type="primary" size="mini" @click="property">资产</el-button>
      <el-button type="primary" size="mini" @click="capacity">容量</el-button>
    </div>

  </div>

</template>
<style lang="scss" scoped>
#canvas {
  position: relative;
  height: calc(100vh - 88px);
  width: 100%;
}
.footer {
  position: absolute;
  bottom: 10px;
  left:0;
}
</style>
<script>
import Mjs3d from './index.js'
import { getData } from '@/api/data1.js'
import { deepClone } from '@/utils'
// 图片
import floorimg from '@/assets/images/floor.jpg'
import floorimg1 from '@/assets/images/floor1.png'
import sceneImg from '@/assets/images/scene.png'
import computerImg from '@/assets/images/computer1.jpg'
import doorright from '@/assets/images/doorright.png'
import doorleft from '@/assets/images/doorleft.png'
import glass from '@/assets/images/glass.png'
import fire from '@/assets/images/fire.png'
import cabintDoor from '@/assets/images/5.png'
import cabintDoor1 from '@/assets/images/1.png'
import cabintDoor2 from '@/assets/images/6.png'
import air from '@/assets/images/2.png'

export default {
  name: 'Home',
  data() {
    return {
      wall: {
        uuid: '',
        name: 'wall',
        type: 'group',
        x: -3250,
        y: 10,
        z: -1070,
        children: []
      },
      floor: {
        uuid: '',
        name: 'floor',
        type: 'cube',
        width: 6500,
        height: 10,
        depth: 2200,
        x: 0,
        y: 5,
        z: 0,
        skin: {
          color: '#6ea1b5',
          skinUp: {
            img: floorimg,
            repeatx: true,
            repeatz: true,
            RX: 105,
            RZ: 105
          }
        }
      },
      floor1: {
        uuid: '',
        type: 'group',
        name: 'floor',
        x: 500,
        y: 10,
        z: 70,
        children: [
          {
            uuid: '',
            type: 'merge',
            parent: {
              uuid: '',
              name: 'floor',
              type: 'cube',
              width: 4500,
              height: 5,
              depth: 1600,
              x: 0,
              y: 5,
              z: 0,
              skin: {
                skinUp: {
                  img: floorimg1,
                  repeatx: true,
                  repeatz: true,
                  RX: 100,
                  RZ: 100
                }
              }
            },
            mergeChild: [
              {
                uuid: '',
                name: 'floor',
                type: 'cube',
                op: '-',
                width: 800,
                height: 5,
                depth: 600,
                x: 1850,
                y: 5,
                z: 600,
                skin: {}
              }
            ]
          }
        ]
      },
      // 屏幕
      scene: {
        uuid: '',
        type: 'cube',
        name: 'scene',
        width: 1000,
        height: 400,
        depth: 20,
        x: 750,
        y: 500,
        z: 75,
        skin: {
          color: '#525252',
          skinRight: {
            img: sceneImg
          }
        }
      },
      door: [
        {
          uuid: '',
          type: 'cube',
          name: 'leftDoor',
          width: 10,
          height: 600,
          depth: 300,
          x: 1500,
          y: 300,
          z: 1450,
          skin: {
            color: '#fff',
            skinFront: {
              img: doorleft
            },
            skinBack: {
              img: doorright
            }
          }
        },
        {
          uuid: '',
          type: 'cube',
          name: 'rightDoor',
          width: 10,
          height: 600,
          depth: 300,
          x: 1500,
          y: 300,
          z: 1750,
          skin: {
            color: '#fff',
            skinFront: {
              img: doorright
            },
            skinBack: {
              img: doorleft
            }
          }
        },
        {
          uuid: '',
          type: 'cube',
          name: 'leftDoor1',
          width: 300,
          height: 600,
          depth: 10,
          x: 5470,
          y: 300,
          z: 1400,
          skin: {
            color: '#fff',
            skinRight: {
              img: doorleft
            },
            skinLeft: {
              img: doorright
            }
          }
        },
        {
          uuid: '',
          type: 'cube',
          name: 'rigthDoor1',
          width: 300,
          height: 600,
          depth: 10,
          x: 5770,
          y: 300,
          z: 1400,
          skin: {
            color: '#fff',
            skinRight: {
              img: doorright
            },
            skinLeft: {
              img: doorleft
            }
          }
        }
      ],
      windows: [],
      baseCabinet: {
        uuid: '',
        type: 'cabinet',
        name: 'cabinet',
        doorDirection: 'front',
        doorName: 'cabinet_door',
        width: 250,
        height: 400,
        depth: 150,
        x: 0,
        y: 5,
        z: 0,
        skin: {
          front: {
            color: '#000',
            skinRight: {
              img: cabintDoor
            }
          },
          up: {
            color: '#000'
          },
          bottom: {
            color: '#000'
          },
          back: {
            color: '#000'
          },
          right: {
            color: '#000'
          },
          left: {
            color: '#000'
          }
        }
      },
      cabinet: {
        uuid: '',
        type: 'group',
        name: 'cabinet',
        x: -1500,
        y: 5,
        z: 0,
        children: []
      },
      fireBox: {
        uuid: '',
        type: 'group',
        name: 'firebox',
        x: 5900,
        y: 0,
        z: 1100,
        children: [
          {
            uuid: '',
            type: 'cube',
            name: 'firebox',
            width: 100,
            height: 10,
            depth: 150,
            x: 0,
            y: 200,
            z: 0,
            skin: {
              color: '#c54e38'
            }
          },
          {
            uuid: '',
            type: 'cube',
            name: 'firebox',
            width: 90,
            height: 200,
            depth: 140,
            x: 0,
            y: 100,
            z: 0,
            skin: {
              color: '#c54e38',
              skinFront: {
                img: fire
              }
            }
          }
        ]
      },
      // 空调
      air: {
        uuid: '',
        type: 'cube',
        name: 'air',
        width: 250,
        height: 400,
        depth: 150,
        x: 4800,
        y: 200,
        z: 570,
        skin: {
          color: '#dededa',
          skinRight: {
            img: air
          }
        }

      }
    }
  },
  mounted() {
    this.render()
  },
  beforeDestroy() {
    this.mjs3d.reset()
  },
  methods: {
    render() {
      this.mjs3d = new Mjs3d()
      this.mjs3d.init(document.getElementById('canvas'))
      // 渲染地板
      this.mjs3d.createObject(this.floor)
      // this.mjs3d.createObject(this.floor1)
      // 渲染墙
      getData().then(res => {
        this.wall.children = res.data
        console.log(res.data)
        this.setWindows()
        this.wall.children = [...this.wall.children, this.scene, ...this.door, ...this.windows, this.fireBox, this.air]
        this.setComputer()
        this.mjs3d.createObject(this.wall)
      })
      this.mjs3d.setTables()
      this.setCabinet()
    },
    // 电脑屏幕
    setComputer() {
      const computer = this.wall.children.filter(item => item.name === 'computer')
      const computerScene = {
        uuid: '',
        type: 'cube',
        width: 3,
        height: 180,
        depth: 280,
        x: 50,
        y: 150,
        z: -100,
        skin: {
          img: computerImg
        }
      }
      computer.forEach(item => {
        item.children = [...item.children, computerScene]
      })
    },
    // 设置窗户
    setWindows() {
      const baseMerge = {
        uuid: '',
        type: 'merge',
        parent: {
          uuid: '',
          type: 'cube',
          name: 'windows',
          width: 400,
          height: 600,
          depth: 30,
          x: 3350,
          y: 400,
          z: 1970,
          skin: {
            color: '#fff'
          }
        },
        mergeChild: [
          {
            op: '-',
            uuid: '',
            type: 'cube',
            name: 'windows',
            width: 380,
            height: 580,
            depth: 30,
            x: 3350,
            y: 400,
            z: 1970
          }
        ]
      }
      const basePlane = {
        uuid: '',
        name: 'glass',
        type: 'plane',
        width: 380,
        height: 580,
        depth: 30,
        x: 3350,
        y: 400,
        z: 1970,
        pic: glass,
        transparent: true,
        opacity: 0.1
      }
      for (let i = 0; i < 8; i++) {
        const x = 1950 + i * 400
        const cloneMerge = deepClone(baseMerge)
        cloneMerge.parent.x = x
        cloneMerge.mergeChild[0].x = x
        const clonePlane = deepClone(basePlane)
        clonePlane.x = x
        this.windows.push(
          cloneMerge,
          clonePlane
        )
      }
    },
    // 设置机柜
    setCabinet() {
      for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 9; j++) {
          const cloneCabinet = deepClone(this.baseCabinet)
          if (i === 3 && j === 8) {
            cloneCabinet.skin = {
              front: {
                color: '#dededa',
                skinRight: {
                  img: cabintDoor1
                }
              },
              back: {
                color: '#dededa'
              },
              up: {
                color: '#dededa'
              },
              bottom: {
                color: '#dededa'
              },
              right: {
                color: '#dededa'
              },
              left: {
                color: '#dededa'
              }
            }
          }
          if (i === 2 && j === 3) {
            cloneCabinet.skin = {
              front: {
                color: '#dededa',
                skinRight: {
                  img: cabintDoor2
                }
              },
              back: {
                color: '#dededa'
              },
              up: {
                color: '#dededa'
              },
              bottom: {
                color: '#dededa'
              },
              right: {
                color: '#dededa'
              },
              left: {
                color: '#dededa'
              }
            }
          }
          const map = {
            1: -250,
            2: -50,
            3: 200
          }
          cloneCabinet.z = map[i]
          cloneCabinet.x = j * 150
          this.cabinet.children.push(cloneCabinet)
        }
      }
      // 左侧三个
      for (let i = 0; i < 3; i++) {
        const clone = deepClone(this.baseCabinet)
        const temp = clone.width
        clone.width = clone.depth
        clone.depth = temp
        clone.doorName = 'cabinet_Rightdoor'
        clone.doorDirection = 'right'
        if (i < 2) {
          clone.skin.front = {
            color: '#000'
          }
          clone.skin.right = {
            color: '#000',
            skinBack: {
              img: cabintDoor
            }
          }
        }
        if (i === 2) {
          clone.skin = {
            front: {
              color: '#dededa'
            },
            back: {
              color: '#dededa'
            },
            up: {
              color: '#dededa'
            },
            bottom: {
              color: '#dededa'
            },
            right: {
              color: '#dededa',
              skinBack: {
                img: cabintDoor1
              }
            },
            left: {
              color: '#dededa'
            }
          }
        }
        const arr = [-230, -100, 30]
        clone.z = arr[i]
        clone.x = -80
        this.cabinet.children.push(clone)
      }

      // 右侧两个
      for (let i = 0; i < 2; i++) {
        const clone = deepClone(this.baseCabinet)
        const temp = clone.width
        clone.width = clone.depth
        clone.depth = temp
        clone.doorDirection = 'left'
        clone.doorName = 'cabinet_Leftdoor'
        console.log(clone)
        clone.skin.front = {
          color: '#000'
        }
        clone.skin.left = {
          color: '#000',
          skinFront: {
            img: cabintDoor
          }
        }
        const arr = [-230, -100]
        clone.z = arr[i]
        clone.x = 2080
        this.cabinet.children.push(clone)
      }
      this.mjs3d.createObject(this.cabinet)
    },
    // 容量
    capacity() {
      this.mjs3d.addUsage('cabinet')
    },
    // 资产
    property() {
      this.mjs3d.restore('usage')
    }
  }
}
</script>
