'use strict'

let messageList = []
let myChat;
let profile_input = document.querySelectorAll('.profile_input');

window.addEventListener('load', function() { //sets default profile_input (radio)
  for (let i = 0; i < profile_input.length; i++) {
    if (profile_input[i].checked) {
      profile_input[i].click();
    }
  }
});

profile_input[0].addEventListener('click', function() { //radio top
  nick_input.disabled = true;
  nick_input.value = 'justinfan' + Math.floor(Math.random() * 100000);
  pass_input.disabled = true;
  pass_input.value = 'SCHMOOPIIE';
});

profile_input[2].addEventListener('click', function() { //radio bottom
  nick_input.disabled = false;
  nick_input.value = '';
  pass_input.disabled = false;
  pass_input.value = '';
});

connect_button.addEventListener('click', function(e) {//Connect button of the field
  if (nick_input.value && pass_input.value && channel_input.value) {

    myChat = new TwitchChat(nick_input.value, pass_input.value, channel_input.value);
    myChat.startChat();
    myChat.addChatListener(chatListener);
    myChat.addStatusListener(statusListener, statusListener, statusListener);
  }
});

function chatListener(message) { //message listener

  messageList.push(message);

  console.log('%c' + message.nick +': %c' + message.message + ' ',
    'font-family:sans-serif;font-size:16px;font-weight:bold;background-color:#ffffff;color:' + message.color,
    'font-family:sans-serif;font-size:16px;background-color:#ffffff;color: #000000');
}

function statusListener(message) {
  console.log(message);
}
