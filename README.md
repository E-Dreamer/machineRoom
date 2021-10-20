#### Build Setup
``` bash
# 配置镜像加速
https://www.ydyno.com/archives/1219.html

# 安装依赖
npm install

# 启动服务 localhost:8013
npm run dev


# 加载3d模型 对于过大的图形处理 
文档地址：https://www.npmjs.com/package/obj2gltf
npm i -g obj2gltf 
使用obj2gltf 来转换成gltf并压缩
-i 输入文件 -o 输出文件
obj2gltf -i xxx.obj -o xxx.gltf

gltf 文件压缩后的文件  地址：https://cnpmjs.org/package/gltf-pipeline
npm install -g gltf-pipeline 

同上 -i -o
gltf-pipeline -i xxx.gltf -o xxx.gltf -d
这里有个坑
引入压缩的文件后 会报错 显示 unexpected token '<' 显示文件引入错误
这是因为draco压缩了
需要将draco文件复制到public下面 且添加 DRACOLoader.setDecoderPath('../../public/draco/')
在vue中解决方法是将draco文件夹复制一份到public下面 不然就会报错
```
## 基本的结构

```javascript
{
  uuid:'',
  name:'', //物体的名称
  width, //x轴方向的长度
  height, //y轴方向的长度
  depth // z轴方向的长度
  x, //x轴位置
  y, //y轴位置
  z, // z轴位置
  <!-- 正方体 | 平面 | 圆柱/多边形柱 | 可开门的正方体 | 组() | 需要计算的 -->
  type: 'cube | plane | cylinder | cabinet |  group | merge | shape | shpere | tube'
  skin:{
    color:'' //表示的整体颜色
    opacity:'' //整体透明度
    transparent: '' //整体是否完全透明
    
      
    // 下面的属性为cube特有
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
# type 为 shpere 球体
{
  uuid:"",
  name:"",
  type:'shpere',
  radius:12,//半径
  x:0,
  y:0,
  z:0,
  rotate:{},
  skin:{
    color:"", 
    img:"",
    transparent: true,
    opacity: 0.6
  }
  widhtS:"", //水平段数
  heightS:"", //垂直段数
  phiStart:"", //指定水平起始角度
  phiLength:"", //指定水平扫描角度大小
  thetaStart:"", //指定垂直起始角度
  thetaLenght:""// 指定垂直扫描角度大小
}

# type 为 cylinder 圆柱体
{
  uuid:"",
  name:"",
  type:'cylinder',
  x:0,
  y:0,
  z:0,
  width:1,// 圆柱体顶部的半径
  height:1,// 底部圆柱体的半径
  depth:1,// 圆柱体的高度
  rotate:{}, // 旋转
  heightSegments:number,// 沿圆柱高度的面行数
  radialSegments:number, //围绕圆柱圆周的分段面数 4就是4边型 越大越圆    
  openEnded:true(Boolean), // 指示圆柱体的末端是开放的还是封闭的
  skin:{
    color:"", 
    img:"",
    transparent: true,
    opacity: 0.6
  }
}
# type 为 merge 合并对象时
{
  type:'merge',
  // 父类物体 同上 type可为 cube | cylinder | shpere | shape 
  parent:{
    //数据配置
     
  } 
  mergeChild:[
      //多个数据配置
  ] 
}

# type 为 group 组
{
    uuid:"",
    name:"",
    type:'group'
    x:0,
    y:0,
    z:0,
    children:[
        //数据配置
    ]
}
```

#### btn 物体点击事件配置

```
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
      obj_event(obj){
          
      }
    }
  ],
  <!-- 鼠标经过 -->
  hover: []
}
```

