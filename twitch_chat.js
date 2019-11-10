'use strict'

class TwitchChat {
  constructor (inputNick, inputPass, inputChannel) {
    this._url = "wss://irc-ws.chat.twitch.tv/"
    this._nick = "beljar";
    this._pass = "oauth:iyeciypaogame8kbvq7bb6g52ca9to";

    if (inputNick) this._nick = inputNick.toLowerCase();
    if (inputPass) this._pass = inputPass.toLowerCase();
    if (inputChannel) this._channel = inputChannel.toLowerCase();
      else this._channel = this._nick;
  }

  startChat() {
    let chatSocket = new WebSocket(this._url);
    let headers = ["CAP REQ :twitch.tv/tags twitch.tv/commands", `PASS ${this._pass}`, `NICK ${this._nick}`, `USER ${this._nick} 8 * :${this._nick}`];
    // let channelIsEnter = false;
    // let messageIndex = 0; //стоит заменить на setTimeout, сравнить messageIndex с количеством выведеных сообщений
    let channel = this._channel;

    this._chatSocket = chatSocket;

    chatSocket.addEventListener('open', function(e) {
      for(let i = 0; i < headers.length; i++) {
        this.send(headers[i]);
      }
    });

    // chatSocket.addEventListener('message', function(e) {
    //   messageIndex++;
    //   if (!channelIsEnter && messageIndex >=2) {
    //     this.send(`JOIN #${channel}`); // проблемы с контекстом
    //     channelIsEnter = !channelIsEnter;
    //   }
    // });
    setTimeout(() => {chatSocket.send(`JOIN #${channel}`);}, 2000);
    let pingSender = setInterval(() => {chatSocket.send('PING');}, 120000);
    return chatSocket;
  }

  sendMessage(yourMessage) {
    this._chatSocket.send(`PRIVMSG #${this._channel} :${yourMessage}`);
  }

  changeChannel(channel) {
    channel = channel.toLowerCase();
    this._chatSocket.send(`PART #${this._channel}`);
    this._channel = channel;
    this._chatSocket.send(`JOIN #${channel}`);
  }

  addChatListener(messageHandler) {
    this._chatSocket.addEventListener('message', function(e) {
      let regNick = /display-name=[^;]+/;
      let regColor = /color=[^;]+/;
      let regMessage = /PRIVMSG.+/;

      let sampleText = e.data;
      let temp = sampleText.match(regNick);
      if (temp === null) return;

      let sampleNick = temp[0];

      let sampleColor;
      try {
        sampleColor = sampleText.match(regColor)[0];
      }
      catch {
        sampleColor = "color=#000000"
      }

      let sampleMessage;
      try { //есть ошибка из-за сообщения о подписке
        sampleMessage = sampleText.match(regMessage)[0];
      }
      catch {
        if (sampleText.includes('USERNOTICE')) { //кстати не факт, что USERNOTICE === new Subscriber, нужно проверять
          console.log('SUBSCRIBER')
        }
        console.error(e.data);
      }

      let indexOfText = sampleMessage.indexOf(':');
      sampleMessage = sampleMessage.slice(indexOfText + 1);

      let messageContainer = {
        nick: sampleNick.split('=')[1],
        color: sampleColor.split('=')[1],
        message: sampleMessage
      };

      messageHandler(messageContainer);
    });
  }

  addStatusListener(statusOpenHandler, statusCloseHandler, statusErrorHandler) {
    this._chatSocket.addEventListener('open', function(e) {
      statusOpenHandler('OPEN');
    });
    this._chatSocket.addEventListener('close', function(e) {
      statusCloseHandler('CLOSED');
    });
    this._chatSocket.addEventListener('error', function(e) {
      statusErrorHandler('ERROR');
    });
  }

  closeSocket() {
    this._chatSocket.close();
  }
}
