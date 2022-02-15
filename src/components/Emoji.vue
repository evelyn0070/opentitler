<template lang="pug">
  span( class="emoji-item-common" :class="['emoji-'+text,isInput?'emoji-size-small':'emoji-size-large',checked? 'checked':'']" @click="emojiClick")

</template>

<script>
  export default {
    name: "Emoji",
    props:{
      text:{
        type: String
      },
      isInput:{
        type: Boolean,
        default: false
      },
      checked:{
        type: Boolean,
        default:false
      }
    },
    methods:{
      emojiClick() {
        this.$emit("click", this.text);
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
