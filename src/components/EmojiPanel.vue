<template>
  <div class="panel">
    <div class="emoji-wrap">
      <emoji v-for="text of emojis" :key="text"
             :checked="text === value"
             :text="text" :is-input="false" @click="handleEmojiClick"></emoji>
    </div>
  </div>
</template>

<script>
  import Emoji from "./Emoji";
  export default {
    name: "EmojiPanel",
    props:{
      value:{
        type: String,
        default: ''
      }
    },
    components: {Emoji},
    data(){
      return {
        emojis: [
          "angry",
          "anguished",
          "astonished",
          "blush",
          "cold_sweat",
          "confounded",
          "confused",
          "cry",
          "disappointed",
          "disappointed_relieved",
          "dizzy_face",
          "expressionless",
          "fearful",
          "flushed",
          "frowning",
          "grimacing",
          "grin",
          "grinning",
          "heart_eyes",
          "hushed",
          "innocent",
          "joy",
          "kissing_closed_eyes",
          "kissing_heart",
          "laughing",
          "neutral_face",
          "no_mouth",
          "open_mouth",
          "pensive",
          "persevere",
          "relaxed",
          "relieved",
          "sleepy",
          "smile",
          "smiley",
          "smirk",
          "sob",
          "stuck_out_tongue",
          "sunglasses",
          "sweat",
          "sweat_smile",
          "scream",
          "wink",
          "unamused",
          "satisfied",
          "worried",
          "stuck_out_tongue_closed_eyes",
          "weary",
          "yum",
          "tired_face",
          "triumph",
          "stuck_out_tongue_winking_eye"
        ]
      }
    },
    methods:{
      handleEmojiClick(a) {
        this.$emit('input',a);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .panel {
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 5px;
    padding: 10px;
    .emoji-wrap{
      height: 164px;
      margin: 0 auto;
    }
  }
</style>
