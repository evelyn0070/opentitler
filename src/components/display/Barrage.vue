<template>
  <div ref="bulletContainer" class="barrage-wrap">
  <span v-for="(item,index) of bullets"
        :key="index"
        :style="item.style"
        @animationend="onanimationend"
        @webkitAnimationEnd="onanimationend"
        class="bullet">{{ item.text }}</span>
  </div>
</template>

<script>
import {Emitter} from "@/event";

export default {
  name: "Barrage",
  props:{
    display:{
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Function | Object,
      default(){
        return {
          bullet:{
            fontSize: 25
          }
        }
      }
    }
  },
  data() {
    return {
      bullets: [],
      lineIndex: 0,
      queueList: [],
      lastTop: -30,
    }
  },
  methods: {
    onanimationend(e) {
      let target = e.currentTarget;
      this.$refs.bulletContainer.removeChild(target)
    },
    startBarrage(){
      let bullet = this.queueList.shift();
      if (bullet){
        let top = this.lastTop + 40;
        if (top > 90){
          top = 10
        }
        this.lastTop = top;
        const style={
          top: `${top}px`
        };
        if (this.display && this.display.bullet && this.display.bullet.fontSize){
          style.fontSize = `${this.display.bullet.fontSize}px`
        }
        this.bullets.push({
          style,
          text: bullet
        })
      }
      let delay = Math.random() * 1000 + 100;
      setTimeout(()=>this.startBarrage(),delay)
    },
    onAddBullet(msg){
      this.queueList.push(msg.msg);
    }
  },
  mounted() {
    setTimeout(()=>this.startBarrage(),2000);
    Emitter.$on('bullet',this.onAddBullet.bind(this))
  },
  beforeDestroy() {
    Emitter.$off('bullet')
  }
}
</script>

<style lang="scss" scoped>
.barrage-wrap {
  position: absolute;
  z-index: 211;
  left: -10px;
  top: 0;
  width: 1300px;
  height: 300px;

  .bullet {
    position: absolute;
    z-index: 10;
    left: 0;
    font-size: 25px;
    line-height: 1.2;
    padding: 0 5px;
    -webkit-animation: right2left 12s linear 1 forwards;
    animation: right2left 12s linear 1 forwards;
  }
}

@keyframes right2left {
  0% {
    transform: translate(1300px);
  }
  100% {
    transform: translate(-100%);
  }
}

</style>
