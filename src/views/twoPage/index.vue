<!--
 * @Author: E-Dreamer
 * @Date: 2021-09-30 14:12:51
 * @LastEditTime: 2021-10-15 10:38:43
 * @LastEditors: E-Dreamer
 * @Description:
-->
<template>
  <div id="canvas">
    <div :class="['box',boxEnable|| 'boxh20']">
      <div class="title">摄像头控制面板 <span
        class="triangle"
        @click="flot"
      /></div>

      <div class="boxcontent">
        <div
          v-for="(item,index) in contorlArr"
          :key="item.id"
          :class="['childrenBox',item.enable || 'childrenBoxh20']"
        >
          <div class="title">{{ item.name }} <span
            :class="['triangle',!item.enable || 'triangle1']"
            @click="childFlot(item)"
          /></div>
          <div class="content">
            <p class="slider">
              <span>仰角:</span>
              <el-slider v-model="item.elevation" :min="-1" :max="1" :step="0.001" @input="(val)=>input(val,'elevation',index)" />
            </p>
            <p class="slider">
              <span>转角:</span>
              <el-slider v-model="item.corner" :min="-1" :max="1" :step="0.001" @input="(val)=>input(val,'corner',index)" />
            </p>
            <p class="slider">
              <span>远近:</span>
              <el-slider v-model="item.distance" :min="-1" :max="1" :step="0.001" @input="(val)=>input(val,'distance',index)" />
            </p>
            <div>
              <p style="font-weight:700">当前监控画面预览</p>
              <p
                :id="item.id"
                class="views"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" size="mini" @click="property">资产</el-button>
      <el-button type="primary" size="mini" @click="capacity">容量</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 10px;
  left:0;
}
.views {
  text-align: center;
}
.slider {
  display: flex;
  align-items: center;
  margin-left:10px;
  span {
    width:50px;
  }
}
.el-slider {
  flex:0.9
}
#monitor {
  position: absolute;
  width: 100;
  height: 100;
  right: 0;
  top: 0;
}
.box {
  max-height: 100%;
  overflow-y: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  width: 250px;
  height: auto;
  background: rgba(150, 153, 161, 0.5);
  .boxcontent {
    height: auto;
    overflow: hidden;
    transition: all 0.1s linear;
  }
}
.boxh20 {
  .boxcontent {
    height: 0;
  }
}
.title {
  padding: 5px 15px;
  display: flex;
  align-items: center;
  text-align: left;
  font-weight: 700;
}
.childrenBox {
  margin-left: 2px;
  background: rgba(150, 153, 161, 0.5);
  .title {
    background-color: rgba(182, 184, 189, 0.5);
    border-bottom: 1px solid #43aff1;
  }
  .content {
    display: block;
    transition: height 0.1s linear;
    overflow: hidden;
  }
}

.childrenBoxh20 {
  .content {
    height: 0;
  }
}

.triangle {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid #868686;
  margin-left: auto;
}
.triangle1 {
  transform: rotate(180deg);
}
#canvas {
  position: relative;
  height: 100%;
  width: 100%;
}
.collapse {
  position: absolute;
  right: 0;
  top: 0;
  width: 200px;
}
</style>
<script>
import Mjs3d from './index.js'
import { getData } from '@/api/data2.js'
export default {
  data() {
    return {
      data: [],
      contorlArr: [],
      boxEnable: true

    }
  },
  mounted() {
    this.mjs3d = new Mjs3d()
    this.render()
  },
  methods: {
    async render() {
      this.mjs3d.init()

      const res = await getData()
      this.data = res.data
      this.data.forEach(item => {
        this.joinImg(item)
        this.mjs3d.createObject(item)
      })

      setTimeout(() => {
        this.mjs3d.setPipeLine()
      }, 1000)

      setTimeout(() => {
        this.createMonitor()
      }, 1000)

      // this.mjs3d.addShapeDRN()

      this.mjs3d.addFireBox()
    },
    joinImg(item) {
      const arr = ['skinUp', 'skinBottom', 'skinRight', 'skinLeft', 'skinFront', 'skinBack']
      if (item.skin) {
        if (item.skin.img) {
          item.skin.img = require(`@/assets/images/${item.skin.img}`)
        }
        arr.forEach(el => {
          if (item.skin[el] && item.skin[el].img) {
            item.skin[el].img = require(`@/assets/images/${item.skin[el].img}`)
          }
        })
      }
      // 对cabinet单独处理
      if (item) {
        if (item.img) {
          item.img = require(`@/assets/images/${item.img}`)
        }
        arr.forEach(el => {
          if (item[el] && item[el].img) {
            item[el].img = require(`@/assets/images/${item[el].img}`)
          }
        })
      }
      // 组的时候
      if (item.type === 'group') {
        item.children.length && item.children.forEach(el => {
          this.joinImg(el)
        })
      }
      // 合并对象的时候
      if (item.type === 'merge') {
        this.joinImg(item.parent)
      }
      if (item.type === 'cabinet') {
        const arr = ['up', 'bottom', 'right', 'left', 'front', 'back']
        arr.forEach(key => {
          this.joinImg(item.skin[key])
        })
      }
    },
    // 生成监视器
    createMonitor() {
      const arr = [
        {
          x: -930,
          y: 400,
          z: 350,
          id: 'monitor_1',
          elevation: 0,
          corner: 0,
          distance: 0
        },
        {
          x: -2980,
          y: 400,
          z: 400,
          id: 'monitor_2',
          elevation: 0,
          corner: 0,
          distance: 0
        },
        {
          x: -800,
          y: 400,
          z: -1700,
          id: 'monitor_3',
          elevation: 0,
          corner: 0,
          distance: 0
        },
        {
          x: 2980,
          y: 400,
          z: 1700,
          id: 'monitor_4',
          rotate: {
            y: Math.PI
          },
          elevation: 0,
          corner: 0,
          distance: 0
        },
        {
          x: -2300,
          y: 400,
          z: -1980,
          id: 'monitor_5',
          rotate: {
            y: -Math.PI / 2
          },
          elevation: 0,
          corner: 0,
          distance: 0
        }
      ]

      arr.forEach((item, index) => {
        this.contorlArr.push({
          name: `摄像头${++index}`,
          id: item.id,
          enable: false,
          elevation: item.elevation,
          corner: item.corner,
          distance: item.distance
        })
        this.$nextTick(() => {
          this.mjs3d.setMonitor(item)
        })
      })
    },
    flot() {
      this.boxEnable = !this.boxEnable
    },
    childFlot(item) {
      item.enable = !item.enable
    },
    input(val, key, item) {
      this.mjs3d.spinMonitor(val, key, item)
    },
    property() {
      this.mjs3d.restore('usage')
    },
    capacity() {
      this.mjs3d.addUsage('cabinet')
    }
  }
}
</script>
