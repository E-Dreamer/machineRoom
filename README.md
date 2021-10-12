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

# type 为 cabinet 时
{
  uuid:'',
  name:"",
  type:"cabinet",
  width:"",
  height:"",
  depth:"",
  x:0,
  y:0,
  z:0,
  skin:{
    front:{
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
    },
    back:{},
    up:{},
    bottom:{},
    left:{},
    right:{}
  }
}

# type 为 tube 时  管道物体
{
  uuid:"",
  name:"",
  type:"tube",
  pathArr:[
    [0,0,0],
    [1,1,1]
  ],
  radius:15,//管道半径
  skin: {
     color: '#3d82c7',
     transparent: true,
     opacity: 0.6
  }
}

btn 物体点击事件配置
const mouseEvent = {
  <!-- 单击 -->
  click: [
    {
     obj_name:"cabinet",//设置的物体的名称
     obj_event(obj){
   
     }
    } 
   或者
    {
      findObject(_objname) {
                // 判断
                if (_objname.indexOf('cabinet') >= 0 && _objname.indexOf('door') >= 0) {
                  return true;
                }
                return false;
      },
    }
  ],
  <!-- 鼠标经过 -->
  hover: []
}

```
