"use strict";
cc._RF.push(module, 'dd428RQ38RFqLYH6Z1vla8o', 'dot');
// scripts/dot.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //开启碰撞检测
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },


    onCollisionEnter: function onCollisionEnter(other, self) {
        //撞击后的效果

        if (this.node.parent.parent.getComponent('circle').status === 'on') {
            this.node.parent.children[1].opacity = 0;
            var particle = this.node.parent.children[0].getComponent(cc.ParticleSystem);

            // 撞击后的爆炸效果
            particle.startSize = 20;
            particle.endSize = 0;
            particle.angleVar = 360;
            particle.duration = 0.1;
            particle.startColor = particle.startColor.setA(255);

            particle.life = 2;
            particle.gravity.y = -500;
            particle.resetSystem();
        }
        //发送撞击事件
        var deadEvent = new cc.Event.EventCustom('CollisionDead', true);
        this.node.dispatchEvent(deadEvent);
    },

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();