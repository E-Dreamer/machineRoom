## 基本的结构
```
{
  uuid:'',
  name:'', //物体的名称
  width, //x轴方向的长度
  height, //y轴方向的长度
  depth // z轴方向的长度
  x, //x轴位置
  y, //y轴位置
  z, // z轴位置
  <!-- 正方体 | 平面 | 圆柱/三角柱 | 可开门的正方体 | 组() | 需要计算的 -->
  type: 'cube | plane | cylinder | cabinet |  group | merge'
  parent:{} // type 为 merge 必须
  mergeChild:[] // type 为 merge 必须
  skin:{
    color:'' //表示的整体颜色
    opacity:'' //整体透明度
    transparent: '' //整体是否完全透明
    skinUp:{
      img:'' ,//该面的贴图
      repeatx: true, //贴图是否重复开启
      repeaty: true,
      RX: 128, //按照多大块重复贴
      RY: 128
      frontimg:'' // type为cabint 可以设置每个面 前后左右上下面的图片 
    }, //y轴向外的面 格外设置
    skinBottom:{}, //y轴靠 0 的面 格外设置
    skinBack:{}, // x轴向外的面 格外设置
    skinFront:{},// x轴靠0的面 格外设置
    skinLeft:{}, // z轴靠0 的面 格外设置
    skinRight:{} //z轴 向外的面 格外设置
  }
}