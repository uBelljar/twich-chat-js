'use strict'

let messageList = []
let _myChat;

window.addEventListener('load', function() {
  for (let i = 0; i < profile_input.length; i++) {
    if (profile_input[i].checked) {
      profile_input[i].click();
    }
  }
});

profile_input[0].addEventListener('click', function() {
  nick_input.disabled = true;
  nick_input.value = 'justinfan' + Math.floor(Math.random() * 100000);
  pass_input.disabled = true;
  pass_input.value = 'SCHMOOPIIE';
});

profile_input[2].addEventListener('click', function() {
  nick_input.disabled = false;
  nick_input.value = '';
  pass_input.disabled = false;
  pass_input.value = '';
});

connect_button.addEventListener('click', function(e) {//Connect button of the field
  if (nick_input.value && pass_input.value && channel_input.value) {

    let myChat = new TwitchChat(nick_input.value, pass_input.value, channel_input.value);
    _myChat = myChat;
    myChat.startChat();

    myChat.addChatListener(chatHandler);
  }
});

function chatHandler(message) {

  messageList.push(message);

  let regNick = /(?<=display-name=)[^;]+/;
  let regMessage = /(?<=PRIVMSG.+:).+/;
  let regColor = /(?<=color=)[^;]+/;

  let sampleNick = message.match(regNick);
  let sampleMessage = message.match(regMessage);
  let sampleColor = message.match(regColor); //error null when 'color=' (has no value)
  if (sampleColor === null) { sampleColor = '#000000';}
  if(sampleNick && sampleMessage) {
  console.log('%c' + sampleNick[0] +': %c' + sampleMessage[0] + ' ',
    'font-family:sans-serif;font-size:16px;font-weight:bold;background-color:#ffffff;color:' + sampleColor,
    'font-family:sans-serif;font-size:16px;background-color:#ffffff;color: #000000');
  }
}
