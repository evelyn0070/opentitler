<template>
  <div>
    <div v-show="visible" ref="charts" class="vote-charts" ></div>
    <div v-if="top" class="vote-top">
      <img alt="" class="vote-img" src="../../assets/img/congratulation.png">
      <div class="top-text">{{top}} is the winner </div>
    </div>
  </div>

</template>

<script>
  import * as echarts from 'echarts'
  import {Emitter} from '../../event'
  export default {
    name: "VoteCharts",
    data(){
      return {
        charts: undefined,
        visible: false,
        choices: ['A','B','C','D'],
        results: [0,0,0,0],
        listener: undefined,
        top: undefined
      }
    },
    mounted() {
      if (!this.charts){
        this.charts = echarts.init(this.$refs.charts);
      }
      this.setOptions();
      console.log('vote charts mounted');
      this.listener = (data)=>{
        console.log('vote charts', data);
        if (data.type === 'start'){
          this.startVote(data.data)
        }else if (data.type ==='end'){
          this.endChoice()
        }else if (data.type === 'choice'){
          this.someChoice(data.data)
        }
        if (Array.isArray(data.choices) && data.choices.length){
          this.choices = data.choices;
        }
        if (Array.isArray(data.results) && data.results.length){
          this.results = data.res;
        }
        this.setOptions()
      };
      Emitter.$on('vote',this.listener.bind(this))
    },
    beforeDestroy() {
      if (this.charts){
        this.charts.dispose()
      }
      Emitter.$off('vote',this.listener)
    },
    methods:{
      setOptions(){
        let options = {
          title: {
            tex: 'vote'
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            data: [...this.choices]
          },
          yAxis: {
            splitLine:{
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#efefef',
                width: 0.5,
              }
            },
            axisLine: {
              show: true,
              color: '#efefef'
            },
            min: 0,
          },
          series: [
            {
              name: 'vote',
              type: 'bar',
              data: [...this.results]
            }
          ],
          grid: {
            left: 40,
            top: 30,
            bottom: 40,
            right: 20,
          }
        };
        this.charts && this.charts.setOption(options, true)
      },
      startVote(choices){
        if (!choices || !choices.length){
          this.choices = ['A','B','C','D']
        }else {
          this.choices = choices;
        }
        let data = [];
        this.choices.forEach(()=>{
          data.push(0)
        });
        this.results = data;
        this.setOptions();
        this.visible = true;
      },
      someChoice(choice){
        let index = this.choices.findIndex(item=>item === choice);
        let copyData = [...this.results];
        copyData[index] = copyData[index] +1;
        this.results = copyData;
        this.setOptions()
      },
      endChoice(){
        let maxChoices = [];
        let max = 0;
        Object.keys(this.results)
        .forEach(k=>{
          let count = this.results[k];
          let choice = this.choices[k];
          if (count > max){
            maxChoices = [];
            maxChoices.push(choice);
            max = count;
          }else if (count === max){
            maxChoices.push(choice)
          }
        });
        if (max === 0 || maxChoices.length === 0){
          this.visible = false
        }else {
          this.top = maxChoices.join(',');
          setTimeout(()=>{
            this.visible = false;
            this.top = undefined;
          },10000)
        }
      }
    }
  }
</script>

<style scoped>
  .vote-charts{
    position: absolute;
    top: 200px;
    left: 10px;
    width: 220px;
    height: 180px;
    z-index: 222;
    border: solid red 1px;
  }
  .vote-img{
    width: 80%;
    height: auto;
    display: block;
    text-align: center;
    margin: 0 auto;
  }
  .vote-top{
    position: absolute;
    width: 240px;
    height: 300px;
    top: 200px;
    left: 500px;
    padding: 15px;
    z-index: 223;
    text-align: center;
    -webkit-animation: congratulation 1s linear 1 forwards;
    animation: congratulation 1s linear 1 forwards;
  }
  .top-text{
    font-weight: bold;
    color: #31CCEC;
    font-size: 20px;
    display: block;
    height: 30px;
    overflow: hidden;
    margin-top: 10px;
  }
  @keyframes congratulation {
    0% {
      transform: scale(0.2) scale(0.2);
      transform-origin:50% 50%;
    }
    80% {
      transform: scale(1.2) scale(1.2);
      transform-origin:50% 50%;
    }
    100% {
      transform: scale(1) scale(1);
      transform-origin:50% 50%;
    }
  }
</style>
