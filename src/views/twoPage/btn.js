/*
 * @Author: E-Dreamer
 * @Date: 2021-10-20 13:18:03
 * @LastEditTime: 2021-10-22 08:47:19
 * @LastEditors: E-Dreamer
 * @Description:
 */
const mouseEvent = {
  click: [
    {
      obj_name: 'cabinet',
      obj_event(obj) {
        const parent = obj.parent.parent
        // cabinet 是6个mesh组成 取第一个 为 顶部的面
        const topMesh = obj.parent.children[0]
        const x = parent.position.x + topMesh.position.x * 2
        const z = parent.position.z + topMesh.position.z * 2
        this.addShapeDRN({
          x: x,
          y: 400,
          z: z
        }, obj)
      }
    },
    // 所有物体的点击(除cabinet外)
    {
      findObject(obj) {
        if (obj && obj.includes('cabinet')) {
          return false
        }
        return true
      },
      obj_event(obj) {
        if (this.createBtn.shapeDRN) {
          this.removeObject('3d扇形图')
          this.createBtn.shapeDRN = false
          return
        }
      }
    }
  ],
  hover: []
}
export default mouseEvent
