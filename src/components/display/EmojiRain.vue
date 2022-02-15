<template>
  <div class="emoji-rain">
    <ul class="rain-panel" id="rainPanel">
      <li v-for="(item,index) in liParams"
          :style="{ left: item.left, animationDuration: item.durTime, webkitAnimationDuration: item.durTime}"
          :class="item.cls"
          :key="index"
          @webkitAnimationEnd="removeDom">
        <span class="rain-item" :style="itemStyle">{{message.msg}}</span>
      </li>
    </ul>
    <div class="play-btn" @click="startRedPacket">开始</div>
  </div>

</template>

<script>
import {Emitter} from "@/event";
export default {
  name: "EmojiRain",
  props:{
    text:{
      type: String,
      default: undefined
    },
    // 动画定义时间
    duration: {
      type: Number,
      default: 3000
    },
    display:{
      type: Object,
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
      liParams: [],
      timer: null,
      message:{
        msg: undefined,
        msgType: undefined
      }
    }
  },
  watch:{
    text(val){
      console.log('emoji change',val);
      if (val && val.length){
        this.startRedPacket();
      }else {
        console.log('is not emoji!')
      }
    }
  },
  computed: {
    itemStyle(){
      const styles = {};
      if (this.display && this.display.bullet && this.display.bullet.fontSize){
        styles.fontSize = `${this.display.bullet.fontSize}px`
      }
      return styles;
    }
  },
  mounted() {
    Emitter.$on('rain',this.onRain.bind(this))
  },
  beforeDestroy() {
    Emitter.$off('rain')
  },
  methods: {
    onRain(msg){
      this.message = msg;
      console.log('EmojiRain onRain',msg);
      this.startRedPacket();
    },
    startRedPacket() {
      let win = 1260;
      let left = parseInt(Math.random() * (win - 50));
      let rotate = parseInt(Math.random() * (45 - -45) - 45) + "deg"; // 旋转角度
      let scales = (Math.random() * (12 - 8 + 1) + 8) * 0.1; // 图片尺寸
      let durTime = Math.random() * (2.5 - 1.2 + 1) + 3 + "s"; // 时间  1.2和1.2这个数值保持一样
      this.liParams.push({
        left: left + "px",
        cls: "move_1",
        transforms: "rotate(" + rotate + ") scale(" + scales + ")",
        durTime: durTime,
      });
      setTimeout(() => {
        clearTimeout(this.timer);
      }, this.duration);
      this.timer = setTimeout(() => {
        this.startRedPacket();
      }, 100);
    },
    removeDom(e) {
      let target = e.currentTarget;
      document.querySelector("#rainPanel").removeChild(target);
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji-rain{
  position: absolute;
  top: 10px;
  left: 10px;
  width: 1260px;
  height: 700px;
  z-index: 199;
  box-sizing: border-box;
  overflow: hidden;
}
.play-btn {
  width: 100%;
  font-size: 20px;
  text-align: center;
  background: red;
  color: #fff;
  cursor: pointer;
  position: absolute;
  height: 40px;
  line-height: 40px;
  display: none;
}

.rain-panel {
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;

  li {
    position: absolute;
    animation: all 3s linear;
    top: -100px;
    z-index: 10;
    list-style: none;
    &.move_1 {
      -webkit-animation: aim_move 5s linear 1 forwards;
      animation: aim_move 5s linear 1 forwards;
    }
    .rain-item{
      font-size: 30px;
    }
  }
}

@keyframes aim_move {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(120vh);
    transform: translateY(120vh);
  }
}
</style>
