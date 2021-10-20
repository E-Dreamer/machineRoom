const mouseEvent = {
  click: [
    {
      obj_name: 'leftDoor',
      obj_event(obj) {
        this.openDoor(obj, 'left', { doorwidth: 'depth' })
      }
    },
    {
      obj_name: 'rightDoor',
      obj_event(obj) {
        this.openDoor(obj, 'right', { doorwidth: 'depth' })
      }
    },
    {
      obj_name: 'leftDoor1',
      obj_event(obj) {
        this.openDoor(obj, 'left', { degflag: '+', diraction: 'x' })
      }
    },
    {
      obj_name: 'rigthDoor1',
      obj_event(obj) {
        this.openDoor(obj, 'right', { degflag: '+', diraction: 'x' })
      }
    },
    {
      obj_name: 'cabinet_door123',
      obj_event(obj) {
        this.openDoor(obj, 'right', { degflag: '+', diraction: 'x', way: 'None' })
      }
    },
    {
      obj_name: 'cabinet_door',
      obj_event(obj) {
        this.openDoor(obj, 'right', { degflag: '+', diraction: 'x', way: 'None' })
        this.createCard(obj)
      }
    },
    {
      obj_name: 'cabinet_Rightdoor',
      obj_event(obj) {
        this.openDoor(obj, 'left', { degflag: '-', doorwidth: 'depth', way: 'None' })
        this.createCard(obj)
      }
    },
    {
      obj_name: 'cabinet_Leftdoor',
      obj_event(obj) {
        this.openDoor(obj, 'right', { doorwidth: 'depth', way: 'None' })
        this.createCard(obj)
      }
    }
  ],
  hover: []
}

export default mouseEvent
