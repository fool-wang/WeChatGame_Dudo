// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // angle: 0,
        // radius: 190,
        // unitAngle: 0.07,
        // centerY: -440,
    },

    resetPostion: function () {
        this.angle = 0
        this.red = this.node.children[0]
        this.blue = this.node.children[1]

        //位置设定
        this.red.x = this.node.x - this.radius
        this.blue.x = this.node.x + this.radius
        this.red.y = this.centerY
        this.blue.y = this.centerY
        this.angle = 0
    },

    rotateControl: function () {
        let self = this

        //键盘监听事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            switch (event.keyCode) {
                case cc.KEY.a:
                    self.roRight = false;
                    self.roLeft = true;
                    break;
                case cc.KEY.d:
                    self.roLeft = false;
                    self.roRight = true;
                    break;
            }
        });

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            switch (event.keyCode) {
                case cc.KEY.a:
                    self.roLeft = false;
                    // self.roRight = false;
                    break;
                case cc.KEY.d:
                    // self.roLeft = false;
                    self.roRight = false;
                    break;
            }
        });

        //触摸事件
        this.node.on('touchstart', function (event) {
            if (event.getLocationX() < self.absolute_centerX) {
                self.roRight = false;
                self.roLeft = true;
            } else {
                self.roLeft = false;
                self.roRight = true;
            }
        });

        this.node.on('touchend', function (event) {
            if (event.getLocationX() < self.absolute_centerX) {
                self.roLeft = false;
                // self.roRight = false;
            } else {
                // self.roLeft = false;
                self.roRight = false;
            }
        });
    },

    drawCenterCircle: function () {
        //绘制中心的圆
        let ctx = this.addComponent(cc.Graphics)

        ctx.lineWidth = 4
        ctx.strokeColor = cc.hexToColor('#555555')
        ctx.strokeColor.a = 150
        ctx.circle(this.node.width / 2, this.node.height / 2 + this.centerY, this.radius)
        ctx.stroke()
    },
    // LIFE-CYCLE CALLBACKS:

    preSetValueLoad: function() {
        //加载预设值
        let inputInfo = cc.find('Controller Node').getComponent('controller').preSetInfo
        this.radius = inputInfo.circleInfo.radius
        this.unitAngle = inputInfo.circleInfo.angularVelocity
        this.centerY = inputInfo.circleInfo.centerY
        // this.deadPauseTime = inputInfo.gameTime.deadPause
        // this.passPause = inputInfo.gameTime.passPause
        this.rewindTime = inputInfo.gameTime.rewind
        this.revolveTime = inputInfo.gameTime.revolve
    },

    onLoad() {
        //设置状态
        this.status = "off" //可以是off, on, pause, rewind
        
        //加载预设值
        this.preSetValueLoad()
        
        //重制位置
        this.resetPostion()
        this.roLeft = false
        this.roRight = false
        this.absolute_centerX = this.node.width / 2

        //加入旋转
        this.rotateControl()

        //绘制图形
        this.drawCenterCircle()
    },

    //start函数在onload之后调用
    start() {

    },

    updateDotPos: function () {
        let posx = Math.cos(this.angle) * this.radius
        let posy = Math.sin(this.angle) * this.radius
        this.blue.x = posx
        this.blue.y = posy + this.centerY
        this.red.x = -posx
        this.red.y = -posy + this.centerY
    },

    update(dt) {
        switch (this.status) {
            case "pause":
                break
            case "rewind":
                if (this.frameMark < this.rewindTime) {
                    this.angle -= (this.rewindAnlge + 2 * Math.PI) / this.rewindTime
                    this.updateDotPos()
                    this.frameMark++
                } else {
                    // console.log()
                    this.status = 'on'
                    this.rewindAnlge = 0
                    this.node.dispatchEvent(new cc.Event.EventCustom('CollisionRelive', true))
                }
                break
            case "revolve":
                if (this.frameMark < this.revolveTime) {
                    this.angle -= (this.revolveAnlge) / this.revolveTime
                    this.updateDotPos()
                    this.frameMark++
                } else {
                    this.status = 'on'
                    this.revolveAnlge = 0
                    this.node.dispatchEvent(new cc.Event.EventCustom('NewLevelStart', true))
                }
                break
            default:
                //正常情况，接受用户交互
                if (this.roLeft) {
                    this.angle += this.unitAngle
                } else if (this.roRight) {
                    this.angle -= this.unitAngle
                }
                //计算新的位置
                this.updateDotPos()
                break
        }
    },
});