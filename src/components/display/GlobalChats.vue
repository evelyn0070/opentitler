<template>
  <div>
    <zoom-sense-connection
        :token="token"
        v-on:zoomsense:loading="loadingChanged"
        v-on:zoomsense:loaded="loaded"
        v-on:zoomsense:tokenerror="tokenError"
        v-on:zoomsense:error="onZoomSceneError"/>
  </div>
</template>

<script>
  import {GlobalConfig} from "../../config";
  import {Emitter} from '../../event'
  import {isEmoji, isVoteEnd, isVoteMsg, isVoteStart} from './utils'

  const sensorId = GlobalConfig.sensorId || 'ZoomSensor_1';


  export default {
    name: "GlobalChats",
    props:{
      token:{
        type: String,
        default: undefined
      },
      display:{
        // eslint-disable-next-line vue/require-prop-type-constructor
        type: Function | Object,
        default(){
          return {
            bullet:{}
          }
        }
      }
    },
    data(){
      return {
        chats: { loading: true },
        emoji: {},
        meeting: undefined,
        sceneData: undefined,
        isLoading: false,
        lastMessageTime: Date.now(),
        msgCount:{},
        choices: []
      }
    },
    computed:{
      isWorking(){
        return !!this.sceneData;
      },
      bulletSettings(){
        return this.display.bullet
      }
    },
    methods:{
      loadingChanged(isLoading){
        this.isLoading = isLoading;
      },
      async loaded(data){
        if (this.sceneData){
          console.log('loaded has done!');
          return ;
        }
        console.log('data',data);
        this.sceneData = data.data;
        this.meeting = data.meeting;
        const meetingKey = this.meeting.meetingid;
        const sensor = await this.sceneData.child('chats').child(meetingKey);
        // this.$rtdbBind('chats', sensor);
        sensor.off('child_changed');
        sensor.on('child_changed',this.onChildChanged.bind(this));

        const emojiSensor = await this.sceneData.child('emoji').child(meetingKey);
        this.$rtdbBind('emoji', emojiSensor);
        emojiSensor.on('child_changed',()=>{
          console.log('emoji changed!')
        })
      },
      isKeywords(text = ''){
        let keywords = this.display.bullet.keywords || '';
        keywords = keywords.split(',');
        for (let k of keywords){
          if (text && text.indexOf(k) > -1){
            return true
          }
        }
        return false
      },
      onZoomSceneError(error){
        console.log(error);
      },
      tokenError(error){
        console.log(error);
      },
      async onChildChanged(){
        const meetingKey = this.meeting.meetingid;
        const db = this.sceneData.database;
        const sensor = await db.ref(`data/chats/${meetingKey}/${sensorId}`)
          .orderByChild("timestamp")
          .startAfter(this.lastMessageTime)
          .limitToLast(1);

        const messages = await sensor.once('value');
        if (!messages.exists()){
          return ;
        }
        messages.forEach(child=>{
          const lastMsg = {
            timestamp: child.child('timestamp').val(),
            msg: child.child('msg').val(),
            msgType: child.child('msgType').val(),
          };
          if (lastMsg.timestamp > this.lastMessageTime){
            this.lastMessageTime = lastMsg.timestamp;
            this.onReceiveMsg(lastMsg);
          }
        })
      },
      async onReceiveMsg(lastMsg){
        const settings = this.bulletSettings || {};
        console.log('lastMsg',lastMsg, settings, this.display);
        let choices = isVoteStart(lastMsg.msg);
        if (choices && choices.length){
          this.choices = choices;
          console.log('start vote choices', choices);
          Emitter.$emit('bullet',{ msg: 'vote start !'});
          return
        }
        if (isVoteMsg(lastMsg.msg,this.choices)){
          Emitter.$emit('bullet',lastMsg);
          return
        }
        if (isVoteEnd(lastMsg.msg)){
          this.choices = [];
          return
        }
        const inSeconds = settings.inDuration || 5;
        const repeatCount = settings.repeatCount? Number(settings.repeatCount): 2;
        const rainRepeat = settings.rainRepeat ? Number(settings.rainRepeat) : 3;
        const meetingKey = this.meeting.meetingid;
        const db = this.sceneData.database;
        let startTime = Date.now() - Number(inSeconds) * 1000;
        const sensor = await db.ref(`data/chats/${meetingKey}/${sensorId}`)
          .orderByChild('timestamp')
          .startAfter(startTime);
        console.log('startTime',startTime);
        const snapshot = await sensor.once('value');
        if (!snapshot.exists()){
          return ;
        }
        const messages = snapshot.val();
        const sameList = Object.values(messages)
        .filter(item=>item.msg === lastMsg.msg);
        if (isEmoji(lastMsg.msg)){
          if (sameList.length >= rainRepeat){
            Emitter.$emit('rain',lastMsg);
          }else if (sameList.length >= repeatCount){
            Emitter.$emit('bullet',lastMsg);
          }
          console.log('emoji repeat', lastMsg.msg, sameList.length)
        } else if (this.isKeywords(lastMsg.msg) && sameList.length >= repeatCount){
          Emitter.$emit('bullet',lastMsg);
        }
      },
    },
    watch:{
      chats(chats){
        console.log('chats',chats,);
        let messages = chats[sensorId];
        console.log('charts',messages)
        // this.onReceiveMsg(Object.values(msg))
      },
      display(){
        // console.log('val',val)
      },
      emoji(list){
        console.log('emoji',list)
      }
    }
  }
</script>

<style scoped>

</style>
