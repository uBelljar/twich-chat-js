'use strict'

let messageList = []
let myChat;
let profile_input = document.querySelectorAll('.profile_input');
let stopScrolling = false;
let wheelScroll = 0;

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

profile_input[2].addEventListener('click', function() { //radio buttom
  nick_input.disabled = false;
  nick_input.value = '';
  pass_input.disabled = false;
  pass_input.value = '';
});

channel_input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    connect_button.click();
  }
});

connect_button.addEventListener('click', function(e) {//Connect to the chat
  if (nick_input.value && pass_input.value && channel_input.value) {

    myChat = new TwitchChat(nick_input.value, pass_input.value, channel_input.value);
    myChat.addChatListener(chatListener);
    myChat.addStatusListener(statusListener, statusListener, statusListener);
    
    let myScroll = new AddScrollBar(message_box);
  }
});

function chatListener(message) { //message listener

  messageList.push(message);

  let messageContainer = document.createElement('div')
  let nickSpan = document.createElement('span');
  let messageSpan = document.createElement('span');

  messageContainer.classList = 'message-container';
  nickSpan.classList = 'message-nick';
  messageSpan.classList = 'message-text';

  nickSpan.style.color = message.color;

  nickSpan.textContent = message.nick + ': ';
  messageSpan.textContent = message.message;

  message_box.appendChild(messageContainer);
  messageContainer.appendChild(nickSpan);
  messageContainer.appendChild(messageSpan);

  message_box.scroll(0, message_box.scrollHeight - message_box.clientHeight + wheelScroll);
}

function statusListener(status) {
  console.log(status);
}

message_box.addEventListener('wheel', function(e) { //прокрутка колёсиком
  wheelScroll += e.deltaY;
  if (wheelScroll > 0) wheelScroll = 0;
  if (wheelScroll < 0 - (message_box.scrollHeight - message_box.clientHeight)) wheelScroll = 0 - (message_box.scrollHeight - message_box.clientHeight);
  message_box.scroll(0, message_box.scrollHeight - message_box.clientHeight + wheelScroll);
  console.log(wheelScroll);
});

document.addEventListener('mouseover', function(e) { //подсказка
  if (e.target.dataset.tooltip) {
    let tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.style.bottom = '40px'
    tooltip.innerHTML = e.target.dataset.tooltip;
    e.target.parentElement.appendChild(tooltip);
  };
});

document.addEventListener('mouseout', function(e) {
  let tooltip = document.querySelector('.tooltip');
  if (tooltip) tooltip.remove();
});
