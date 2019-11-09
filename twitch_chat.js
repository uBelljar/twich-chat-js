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
    let channelIsEnter = false;
    let messageIndex = 0;
    let channel = this._channel;

    this._chatSocket = chatSocket;

    chatSocket.addEventListener('open', function(e) {
      for(let i = 0; i < headers.length; i++) {
        this.send(headers[i]);
      }
    });

    chatSocket.addEventListener('message', function(e) {
      messageIndex++;
      if (!channelIsEnter && messageIndex >=2) {
        this.send(`JOIN #${channel}`); // проблемы с контекстом
        channelIsEnter = !channelIsEnter;
      }
    });

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
      messageHandler(e.data);
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
