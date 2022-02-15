import {Emitter} from '../../event'
/**
 * is emoji
 * @param text
 * @return {boolean}
 */
export const isEmoji = (text)=>{
  for ( let i = 0; i < text.length; i++) {
    let hs = text.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (text.length > 1) {
        let char = text.charCodeAt(i + 1);
        let uc = ((hs - 0xd800) * 0x400) + (char - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (text.length > 1) {
      let ls = text.charCodeAt(i + 1);
      if (ls === 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030
        || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b
        || hs === 0x2b50) {
        return true;
      }
    }
  }
};

/**
 * 是否为发起投票的消息
 * @param text
 * @return {string[]|boolean}
 */
export const isVoteStart = (text = '')=>{
  if (/(vote start:)([A-Za-z,]+)/g.test(text)){
    let choices = text.replace('vote start:','');
    choices = choices.split(',');
    Emitter.$emit('vote',{
      type: 'start',
      data: choices
    });
    return choices;
  }
  return false
};

export const isVoteEnd = (text)=>{
  if (/vote end/.test(text)){
    Emitter.$emit('vote',{
      type: 'end',
    });
    return true;
  }
};

export const  isVoteMsg = (text, choices =[])=>{
  if (choices.indexOf(text) > -1){
    Emitter.$emit('vote',{
      type: 'choice',
      data: text
    });
    return true
  }
  return false;
};
