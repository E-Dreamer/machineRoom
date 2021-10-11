<!--
 * @Author: E-Dreamer
 * @Date: 2021-09-30 14:12:51
 * @LastEditTime: 2021-10-11 14:28:07
 * @LastEditors: E-Dreamer
 * @Description:
-->
<template>
  <div id="canvas">
    <el-collapse
      v-model="activeName"
      accordion
      class="collapse"
    >
      <el-collapse-item
        title="摄像头控制面板"
        name="1"
      />
    </el-collapse>
  </div>
</template>
<style lang="scss" scoped>
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
import Mjs3d from '@/threejs'
import { getData } from '@/api/data2.js'

// import floor from '@/assets/images/floor2.png'
export default {
  data() {
    return {
      data: [],
      activeName: ''
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
    }
  }
}
</script>
