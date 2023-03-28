// 聊天室元件 Chatroom
class Chatroom extends HTMLElement {

  CHATROOM_ID;
  CHATROOM_NAME;
  CHATROOM_SINCE;

  static observedAttributes = ["chatroom-active"];

  constructor() {
    super();
  }

  connectedCallback() {
    this.CHATROOM_ID = this.getAttribute("chatroom-id");
    this.CHATROOM_NAME = this.getAttribute("chatroom-name");
    // let dt = new Date(this.getAttribute("chatroom-created-at") * 1000);
    // let since_string = `建立自 ${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}`;
    // this.CHATROOM_SINCE = since_string;

    let html;

    if (this.getAttribute("chatroom-active") == "true") {
      html = `
      <li>
        <a class="is-size-5 py-4 _chatroom_name">
          <span class="is-pulled-left has-text-success"><i class="fas fa-circle"></i></span>
          <span class="ml-4">${this.CHATROOM_NAME}</span>
          <span class="icon is-pulled-right _setting js-modal-trigger" data-target="modal-chatroom-setting">
            <i class="fas fa-ellipsis-vertical"></i>
          </span>
        </a>
      <li>
      `
    } else {
      html = `
      <li>
        <a class="is-size-5 py-4 _chatroom_name">
          <span class="is-pulled-left" style="color: rgba(0, 0, 0, 0);"><i class="fas fa-circle"></i></span>
          <span class="ml-4">${this.CHATROOM_NAME}</span>
          <span class="icon is-pulled-right _setting js-modal-trigger" data-target="modal-chatroom-setting">
            <i class="fas fa-ellipsis-vertical"></i>
          </span>
        </a>
      <li>
      `
    }

    let chatMemberObserver = new Observer(this.CHATROOM_ID);
    chatMembersObservable.add(chatMemberObserver);

    this.innerHTML = html;

    // 如果沒有設定聊天室本身的名字 (預設一個空格)，改用聊天室成員的暱稱或名字組成
    if(this.CHATROOM_NAME.trim().length === 0) {
      fetch(`${API_ROOT}${API_CHAT_MEMBER}?action=chatroom_member&chatroom_id=${this.CHATROOM_ID}`)
        .then((res) => res.json())
        .then((body) => 
          {
            // 排除使用者本人
            let members = body.dataList;
            let others = members.filter(m => m.id != specifier_id);
            let title_names = [];
            for (let i = 0; i < others.length; i++) {
              // 若有暱稱則用暱稱 (username)；若無，則用名字 (name)
              let name_show = others[i].hasOwnProperty("username") && others[i].username != "" ? others[i].username : others[i].name;
              title_names.push(name_show);
              // 只取 3 位聊天室成員
              if (title_names.length == 3) break;
            }
            // 若排除本人的成員數超過三人，則說明有更多成員
            this.CHATROOM_NAME = others.length > 3 ? title_names.join("、") + " ..." : title_names.join("、");
            this.setAttribute("chatroom-name", this.CHATROOM_NAME);
            let chname = document.createElement("span");
            // chname.classList.add("ml-2");
            chname.textContent = this.CHATROOM_NAME;
            // document.querySelector(`chatroom-component[chatroom-id="${this.CHATROOM_ID}"] a._chatroom_name`).firstChild.textContent = this.CHATROOM_NAME;
            document.querySelector(`chatroom-component[chatroom-id="${this.CHATROOM_ID}"] a._chatroom_name`).appendChild(chname);
          }
        )
        .catch((err) => console.log(err));   
    }
     

    this.addEventListener("click", (event) => {

      selectFromMenu(event);
      let newItem = document.createElement("chatlog-area-component");
      newItem.setAttribute("chatroom-id", this.CHATROOM_ID);
      newItem.setAttribute("chatroom-name", this.CHATROOM_NAME);

      document.querySelector("div._chat_log").innerHTML = '';
      document.querySelector("div._chat_log").appendChild(newItem);

    });

    const $trigger = this.querySelector(`span._setting[data-target="modal-chatroom-setting"]`);
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      event.stopPropagation();
      document.querySelector("chatroom-setting-modal").setAttribute("chatroom-id", this.CHATROOM_ID);
      openModal($target);
    });

  }

  attributeChangedCallback(attr, prev, curr) {
    switch (attr) {
      case "chatroom-active":
        let activeBulb = document.querySelector(`chatroom-component[chatroom-id="${this.CHATROOM_ID}"] span.is-pulled-left`);
        if (prev == "true" && curr == "false") {
          // document.querySelector(`chatroom-component[chatroom-id="${this.CHATROOM_ID}"] span.is-pulled-left`).remove();
          activeBulb.classList.remove("has-text-success");
          // activeBulb.classList.add("has-text-white");
          activeBulb.style = "color: rgba(0, 0, 0, 0);";
        };
        if (prev == "false" && curr == "true") {
          // activeBulb.classList.remove("has-text-white");
          activeBulb.style = '';
          activeBulb.classList.add("has-text-success");
          // let spanNode = document.createElement("span");
          // spanNode.classList.add("is-pulled-left");
          // spanNode.classList.add("has-text-success");
          // let iNode = document.createElement("i");
          // iNode.classList.add("fas");
          // iNode.classList.add("fa-circle");
          // spanNode.appendChild(iNode);
          // document.querySelector(`chatroom-component[chatroom-id="${this.CHATROOM_ID}"] a._chatroom_name`).appendChild(spanNode);
        }
        break;
    }
  }

}

// 聊天紀錄側邊面板 ChatLogSide (目前棄用)
class ChatLogSide extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    let style = document.createElement("style");
    style.textContent = `
    @font-face {
      font-family: FakePearl-ExtraLight;
      src: url(https://cdn.jsdelivr.net/gh/max32002/FakePearl@1.1/webfont/FakePearl-ExtraLight.woff2) format("woff2"),
           url(https://cdn.jsdelivr.net/gh/max32002/FakePearl@1.1/webfont/FakePearl-ExtraLight.woff) format("woff");
    }

    * {
      box-sizing: border-box;
      font-family: "FakePearl-ExtraLight";
      color: rgb(39, 89, 109);
    }

    .floating-chat {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      bottom: 2%;
      right: 1%;
      width: 40px;
      height: 40px;
      transform: translateY(70px);
      transition: all 250ms ease-out;
      border-radius: 50%;
      opacity: 0;
      background-color: white;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }
    .floating-chat.enter:hover {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
      opacity: 1;
    }
    .floating-chat.enter {
      transform: translateY(0);
      opacity: 0.6;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.14);
    }
    .floating-chat.expand {
      width: 350px;
      max-height: 450px;
      height: 450px;
      border-radius: 5px;
      cursor: auto;
      opacity: 1;
    }
    .floating-chat :focus {
      outline: 0;
      border-color: #dd5b0b;
      box-shadow: 0 0 0 0.125rem rgba(221, 91, 11, 0.25);
    }
    .floating-chat button {
      background: transparent;
      border: 0;
      border-radius: 3px;
      cursor: pointer;
    }
    .floating-chat .chat {
      display: flex;
      flex-direction: column;
      position: absolute;
      opacity: 0;
      width: 1px;
      height: 1px;
      border-radius: 50%;
      transition: all 250ms ease-out;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .floating-chat .chat.enter {
      opacity: 1;
      border-radius: 0;
      margin: 10px;
      width: auto;
      height: auto;
    }
    .floating-chat .chat .header {
      flex-shrink: 0;
      padding-bottom: 10px;
      display: flex;
      background: transparent;
    }
    .floating-chat .chat .header .title {
      flex-grow: 1;
      flex-shrink: 1;
      font-weight: 600;
      padding: 0 5px;
    }
    .floating-chat .chat .header button {
      flex-shrink: 0;
    }
    .floating-chat .chat .messages {
      padding: 10px;
      margin: 0;
      list-style: none;
      overflow-y: scroll;
      overflow-x: hidden;
      flex-grow: 1;
      border-radius: 4px;
      background: transparent;
    }
    .floating-chat .chat .messages::-webkit-scrollbar {
      width: 5px;
    }
    .floating-chat .chat .messages::-webkit-scrollbar-track {
      border-radius: 5px;
      background-color: rgba(250, 250, 250, 0.7);
    }
    .floating-chat .chat .messages::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgba(125, 125, 125, 0.5);
    }
    .floating-chat .chat .messages li {
      position: relative;
      clear: both;
      display: inline-block;
      padding: 9px 13px;
      margin: 0 0 20px 0;
      font: 12px/16px;
      border-radius: 10px;
      background-color: rgb(241, 241, 241);
      word-wrap: break-word;
      max-width: 81%;
    }
    .floating-chat .chat .messages li:before {
      position: absolute;
      top: 0;
      width: 25px;
      height: 25px;
      border-radius: 25px;
      content: "";
      background-size: cover;
    }
    .floating-chat .chat .messages li:after {
      position: absolute;
      top: 10px;
      content: "";
      width: 0;
      height: 0;
      border-top: 10px solid rgba(195, 195, 195, 0.2);
    }
    .floating-chat .chat .messages li.self {
      animation: show-chat-odd 0.15s 1 ease-in;
      -moz-animation: show-chat-odd 0.15s 1 ease-in;
      -webkit-animation: show-chat-odd 0.15s 1 ease-in;
      float: right;
      margin-right: 45px;
    }
    .floating-chat .chat .messages li.self:before {
      right: -45px;
      background-image: url(https://github.com/Thatkookooguy.png);
    }
    .floating-chat .chat .messages li.self:after {
      border-right: 10px solid transparent;
      right: -10px;
    }
    .floating-chat .chat .messages li.other {
      animation: show-chat-even 0.15s 1 ease-in;
      -moz-animation: show-chat-even 0.15s 1 ease-in;
      -webkit-animation: show-chat-even 0.15s 1 ease-in;
      float: left;
      margin-left: 45px;
    }
    .floating-chat .chat .messages li.other:before {
      left: -45px;
      background-image: url(https://github.com/ortichon.png);
    }
    .floating-chat .chat .messages li.other:after {
      border-left: 10px solid transparent;
      left: -10px;
    }
    .floating-chat .chat .footer {
      flex-shrink: 0;
      display: flex;
      padding-top: 10px;
      max-height: 90px;
      background: transparent;
    }
    .floating-chat .chat .footer .text-box {
      border-radius: 3px;
      background: rgb(235, 235, 235);
      min-height: 100%;
      min-width: 80%;
      margin: 0 5px;     
      overflow-y: auto;
      padding: 2px 5px;
    }
    .floating-chat .chat .footer .text-box::-webkit-scrollbar {
      width: 5px;
    }
    .floating-chat .chat .footer .text-box::-webkit-scrollbar-track {
      border-radius: 5px;
      background-color: rgba(125, 125, 125, 0.7);
    }
    .floating-chat .chat .footer .text-box::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgba(250, 250, 250, 0.1);
    }
    button.close {
      border-radius: 50%;
    }
    .footer button {
      font-size: 20px;
    }
    button:hover {
      background-color: rgb(231, 231, 231);
    }
    `;
    
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    let container = document.createElement("div");
    container.setAttribute("style","position: fixed; bottom: 0%; right: 20%");
    container.innerHTML = `
    <div class="floating-chat enter expand">
      <div class="chat enter" style="">
          <div class="header">
              <span class="title">
                ${this.getAttribute("chatroom-name")}
              </span>
              <button class="close">
              ✖
              </button>      
          </div>
          <ul class="messages">
              <li class="self">嗷嗚嗚嗚，汪汪汪</li>
              <li class="self">我們是狗嗎？🐶</li>
              <li class="other">不對</li>
              <li class="self">你確定～？</li>
              <li class="other">是的.... -___-</li>
              <li class="self">如果我們不是狗.... 那我們就是猴子 🐵</li>
              <li class="other">我討厭你</li>
              <li class="self">別這樣嘛！這裡是香蕉，給你 🍌</li>
              <li class="other">......... -___-</li>
          </ul>
          <div class="footer">
              <button>❐</button>
              <div class="text-box" contenteditable="true" disabled="true"></div>
              <button id="sendMessage" class="send"><b>➢</b></button>
          </div>
      </div>
    </div>
    `;
    this.shadowRoot.appendChild(container);
    
    let messageList = this.shadowRoot.querySelector("ul.messages");

    this.shadowRoot.querySelector("button.close").addEventListener("click", () => {
      document.getElementById("cols-chatlog-area").removeChild(this);
    });

    this.shadowRoot.querySelector("button.send").addEventListener("click", () => {
      let msg = this.shadowRoot.querySelector("div.text-box").textContent.trim();
      if(msg == "") alert("聊天訊息內容不能空白");
      let newItem = document.createElement("li");
      newItem.textContent = msg;
      newItem.setAttribute("class", "self");
      messageList.appendChild(newItem);
    });

    const chat_ws = new WebSocket(WS_ROOT + `/chat-ws/${specifier_id}`);

    chat_ws.onopen = (event) => console.log("Connect Success!");

    chat_ws.onmessage = (event) => {
      let messages = JSON.parse(event.data);
      messages.forEach(m => {
        let newItem = document.createElement("li");
        let newItemType = m.senderId == specifier_id ? "self" : "other";
        newItem.classList.add(newItemType);
        newItem.textContent = m.message;
        messageList.appendChild(newItem);
      });
    };
	
  }

}

// 聊天紀錄區域 ChatLogArea
class ChatLogArea extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    let style = document.createElement("style");
    style.textContent = `
    @font-face {
      font-family: FakePearl-ExtraLight;
      src: url(https://cdn.jsdelivr.net/gh/max32002/FakePearl@1.1/webfont/FakePearl-ExtraLight.woff2) format("woff2"),
           url(https://cdn.jsdelivr.net/gh/max32002/FakePearl@1.1/webfont/FakePearl-ExtraLight.woff) format("woff");
    }

    * {
      box-sizing: border-box;
      font-family: "FakePearl-ExtraLight";
      color: rgb(39, 89, 109);
    }
    .floating-chat {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      background-color: white;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }
    .floating-chat.enter {
      transform: translateY(0);
    }
    .floating-chat.expand {
      width: 723px;
      height: 548px;
      cursor: auto;
      opacity: 1;
    }
    .floating-chat :focus {
      outline: 0;
      border-color: #dd5b0b;
      box-shadow: 0 0 0 0.125rem rgba(221, 91, 11, 0.25);
    }
    .floating-chat button {
      background: transparent;
      border: 0;
      border-radius: 3px;
      cursor: pointer;
    }
    .floating-chat .chat {
      display: flex;
      flex-direction: column;
      position: absolute;
      width: 1px;
      height: 1px;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .floating-chat .chat.enter {
      opacity: 1;
      margin: 10px;
      width: auto;
      height: auto;
    }
    .floating-chat .chat .messages {
      padding: 10px;
      margin: 0;
      list-style: none;
      overflow-y: scroll;
      overflow-x: hidden;
      flex-grow: 1;
    }
    .floating-chat .chat .messages::-webkit-scrollbar {
      width: 5px;
    }
    .floating-chat .chat .messages::-webkit-scrollbar-track {
      border-radius: 5px;
      background-color: rgba(250, 250, 250, 0.7);
    }
    .floating-chat .chat .messages::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgba(125, 125, 125, 0.5);
    }
    
    .floating-chat .chat .footer {
      flex-shrink: 0;
      display: flex;
      padding-top: 10px;
      max-height: 90px;
      background: transparent;
    }
    .floating-chat .chat .footer .text-box {
      border-radius: 3px;
      background: rgb(237, 237, 237);
      min-height: 100%;
      min-width: 80%;
      margin: 0 5px;     
      overflow-y: auto;
      padding: 2px 5px;
    }
    .floating-chat .chat .footer .text-box::-webkit-scrollbar {
      width: 5px;
    }
    .floating-chat .chat .footer .text-box::-webkit-scrollbar-track {
      border-radius: 5px;
      background-color: rgba(125, 125, 125, 0.7);
    }
    .floating-chat .chat .footer .text-box::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgba(250, 250, 250, 0.1);
    }
    .footer button {
      font-size: 20px;
    }
    button:hover {
      background-color: rgb(237, 237, 237);
    }
    `;
    
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    let container = document.createElement("div");
    container.innerHTML = `
    <div class="floating-chat enter expand">
      <div class="chat enter">
          <ul class="messages _msg_list">
          </ul>
          <div class="footer">
              <button>❐</button>
              <div class="text-box" contenteditable="true" disabled="true"></div>
              <button id="sendMessage" class="send"><b>➢</b></button>
          </div>
      </div>
    </div>
    `;
    this.shadowRoot.appendChild(container);
    
    let messageList = this.shadowRoot.querySelector("ul._msg_list");

    // 發送聊天訊息
    this.shadowRoot.querySelector("button.send").addEventListener("click", () => {
      let input_div = this.shadowRoot.querySelector("div.text-box");
      let msg = input_div.textContent.trim();
      if(msg == "") {
        alert("聊天訊息內容不能空白");
      } else {
        this.sendMessage(chat_ws, msg);
      }
      input_div.textContent = '';
      input_div.focus();
    });

    // 建立聊天室的 WebSocket 連線
    const chat_ws = new WebSocket(`${WS_ROOT}/chat-ws/${specifier_id}`);

    // 連線成功時
    chat_ws.onopen = (event) => {
      console.log("成功連線到 chat-ws");
      // 請求歷史聊天訊息
      let wrapper = new Object();
      wrapper.messageType = "retrieve-history";
      wrapper.memberId = specifier_id;
      wrapper.chatroomId = this.getAttribute("chatroom-id");
      chat_ws.send(JSON.stringify(wrapper));
    };

    // 收到伺服器端的訊息時
    chat_ws.onmessage = (event) => {
      let wrapper = JSON.parse(event.data);
      switch (wrapper.messageType) {
        case 'reload-history': // 處理歷史聊天訊息
          let messages = wrapper.messageContent;
          if(messages.length == 0) return;
          messages.forEach(m => {
            let newItem =  m.senderId == specifier_id ? document.createElement("msg-self") : document.createElement("msg-other");
            newItem.textContent = m.message;
            newItem.setAttribute("sender-id", m.senderId);
            newItem.setAttribute("sender-nickname", m.senderNickname);
            messageList.appendChild(newItem);
          });
          messageList.scrollTop = messageList.scrollHeight;
          break;
        case 'new-message': // 處理新的聊天訊息
          let msg = wrapper.messageContent;
          let newItem = msg.senderId == specifier_id ? document.createElement("msg-self") : document.createElement("msg-other");
          if (msg.senderId == specifier_id) {
            newItem = document.createElement("msg-self");
            newItem.setAttribute("sender-id", specifier_id);
            newItem.setAttribute("sender-nickname", specifier_username);
          } else {
            newItem = document.createElement("msg-other");
            newItem.setAttribute("sender-id", msg.senderId);
            newItem.setAttribute("sender-nickname", msg.senderNickname);
          }
          newItem.textContent = msg.message;
          messageList.appendChild(newItem);
          messageList.scrollTop = messageList.scrollHeight;
          break;
        case 'new-chatroom':
          console.log(wrapper.messageContent);
          let list = document.querySelector("ul._chatroom_list");
          let newChatroom = document.createElement("chatroom-component");
          newChatroom = prepareAttributes(newChatroom, wrapper.messageContent, 'chatroom');
          newChatroom.setAttribute("chatroom-active", 'false');
          list.append(newChatroom);
          break;
        default:
          console.log(`chat_ws.onmessage failed: ${wrapper}`)
          break;
      }
      
    };
	
  }

  sendMessage(webSocket, msg) {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);  
    let messageContent = new Object();
    messageContent.senderId = specifier_id;
    messageContent.senderNickname = specifier_username;
    messageContent.chatroomId = this.getAttribute("chatroom-id");
    messageContent.message = msg;
    messageContent.sentAt = timestamp;
    let wrapper = new Object();
    wrapper.messageType = "new-message";
    wrapper.messageContent = messageContent;
    wrapper.memberId = specifier_id;
    wrapper.chatroomId = this.getAttribute("chatroom-id");
    webSocket.send(JSON.stringify(wrapper));
  }
}

// 聊天訊息範本
class ChatMessageTemplate extends HTMLElement {

  style;
  SELF_MSG_BG_COLOR = 'hsl(197, 47%, 93%)';
  OTHER_MSG_BG_COLOR = 'rgb(243, 243, 243)';

  constructor() {
    super();

    this.style = document.createElement("style");
    this.style.textContent = 
    `
    @font-face {
      font-family: FakePearl-ExtraLight;
      src: url(https://cdn.jsdelivr.net/gh/max32002/FakePearl@1.1/webfont/FakePearl-ExtraLight.woff2) format("woff2"),
           url(https://cdn.jsdelivr.net/gh/max32002/FakePearl@1.1/webfont/FakePearl-ExtraLight.woff) format("woff");
    }

    * {
      box-sizing: border-box;
      font-family: "FakePearl-ExtraLight";
      color: rgb(39, 89, 109);
    }
    li {
      position: relative;
      clear: both;
      display: inline-block;
      padding: 9px 13px;
      margin: 0 0 20px 0;
      font: 12px/16px;
      border-radius: 10px;
      word-wrap: break-word;
      max-width: 81%;
    }
    li:before {
      position: absolute;
      top: 0;
      width: 30px;
      height: 30px;
      border-radius: 30px;
      content: "";
      background-size: cover;
    }
    li:after {
      position: absolute;
      top: 10px;
      content: "";
      width: 0;
      height: 0;
    } 
    `;
  }
}

// 來自自己的訊息
class SelfMessage extends ChatMessageTemplate {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    let moreStyle = 
    `
    li.self {
      background-color: ${this.SELF_MSG_BG_COLOR};
      float: right;
      margin-right: 45px;
    }
    li.self:after {
      border-top: 10px solid ${this.SELF_MSG_BG_COLOR};
      border-right: 10px solid transparent;
      right: -10px;
    }
    `;

    this.style.textContent += moreStyle;
    this.shadowRoot.appendChild(this.style);
  }

  connectedCallback() {
    let moreStyle = 
    `
    li.self:before {
      right: -45px;
      // background-image: url(https://github.com/Thatkookooguy.png);
      background-image: url(${API_ROOT}${API_IMG_AVATAR}?member_id=${this.getAttribute("sender-id")});
    }
    `;

    let styleTag = document.createElement("style");
    styleTag.textContent = moreStyle;
    this.shadowRoot.appendChild(styleTag);

    let newItem = document.createElement("li");
    newItem.setAttribute("class","self");
    newItem.textContent = this.textContent;
    this.shadowRoot.appendChild(newItem);
  }

}

// 來自別人的訊息
class OtherMessage extends ChatMessageTemplate {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    let moreStyle = 
    `
    li.other {
      background-color: ${this.OTHER_MSG_BG_COLOR};
      float: left;
      margin-left: 45px;
    }
    li.other:after {
      border-top: 10px solid ${this.OTHER_MSG_BG_COLOR};
      border-left: 10px solid transparent;
      left: -10px;
    }
    `;

    this.style.textContent += moreStyle;
    this.shadowRoot.appendChild(this.style);
  }

  connectedCallback() {
    let moreStyle = 
    `
    li.other:before {
      left: -45px;
      // background-image: url(https://github.com/Thatkookooguy.png);
      background-image: url(${API_ROOT}${API_IMG_AVATAR}?member_id=${this.getAttribute("sender-id")});
    }
    `;
    let styleTag = document.createElement("style");
    styleTag.textContent = moreStyle;
    this.shadowRoot.appendChild(styleTag);

    let newItem = document.createElement("li");
    newItem.setAttribute("class","other");
    newItem.textContent = `${this.getAttribute("sender-nickname")}：${this.textContent}`;
    this.shadowRoot.appendChild(newItem);
  }

}

// SearchFromInput
class SearchFromInput extends HTMLElement {

  async onInputChange(event) {
    // 驗證查詢字串是否為空
    let search_text =  event.target.value.trim();

    // 取得此 DOM 元件和搜尋會員的 API 端點
    const thisModal = document.querySelector(".modal.is-active").parentElement;
    const spinner = thisModal.querySelector("span._search_loading");
    
    spinner.style["display"] = "block";

    // 取得 Ajax 回傳資料
    let ajax_call_url;
    if (search_text == '') {
      ajax_call_url = `${API_ROOT}${API_FRIEND}?member_id=${specifier_id}&query_type=friend&limit=100&offset=0&sortingColumn=member_account&sortingOrder=ASC`;
    } else {
      ajax_call_url = `${API_ROOT}${API_CHAT_MEMBER}?action=member&search_text=${search_text}&limit=100&offset=0&sortingColumn=member_account&sortingOrder=ASC`;
    }
    
    const response_data = await fetch(ajax_call_url).then(response => response.json());
    const searchResults = response_data.dataList;

    // 處理回傳結果
    if (searchResults.length == 0) {
      thisModal.NODE_LIST_SEARCH.innerHTML = '';
      spinner.style["display"] = "none";
      thisModal.NODE_NO_RESULTS.style["display"] = "block";
    } else {
      thisModal.NODE_NO_RESULTS.style["display"] = "none";
      thisModal.NODE_LIST_SEARCH.innerHTML = '';
      searchResults.forEach(member => {
        let node = newSearchResult(member);
        node.addEventListener("click", (event) => {
          let id = event.target.closest("li").getAttribute("data-id");
          let nickname = event.target.closest("li").getAttribute("data-nickname");

          // 檢查是否已選擇，存在於，存在於上方 _chatroom_members 區塊
          let added_members = thisModal.NODE_DIV_MEMBERS.querySelectorAll(`a[class="tag is-info is-light"]`);
          let canAdd = true;
          for (let member of added_members) {
            if (member.getAttribute("data-id") == id) {
              canAdd = false;
              break;
            }
          }

          if (canAdd) {
            let newChatMember = newChatroomMember(nickname, id);
            thisModal.NODE_DIV_MEMBERS.appendChild(newChatMember);
          } else {
            alert("已選擇此會員加入，請再選擇其他人");
          }
        })
        thisModal.NODE_LIST_SEARCH.appendChild(node);
      })
      spinner.style["display"] = "none";
    }

    function newSearchResult(member) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      let nickname = member.username == undefined ? member.name : member.username; 
      a.innerHTML = `<b>${nickname}</b> - ${member.name} - ${member.account}`;
      li.setAttribute("data-id", member.id)
      li.setAttribute("data-nickname", nickname);
      li.appendChild(a);
      return li;
    }

    function newChatroomMember(nickname, id) {
      let aTagNickname = document.createElement("a");
      let aTagDelete = document.createElement("a");
      let divTags = document.createElement("div");
      let divControl = document.createElement("div");
      aTagNickname.setAttribute("class", "tag is-info is-light");
      aTagNickname.setAttribute("data-id", id);
      aTagNickname.textContent = nickname;
      aTagDelete.setAttribute("class", "tag is-delete");
      divTags.setAttribute("class", "tags has-addons are-medium");
      divControl.setAttribute("class", "control");
      divTags.appendChild(aTagNickname);
      divTags.appendChild(aTagDelete);
      divControl.appendChild(divTags);
      aTagDelete.addEventListener("click", (event) => event.target.closest("div.control").remove());
      return divControl;
    }
  }

}

// 聊天室設定的 Modal
class ChatroomSettingModal extends SearchFromInput {

  NODE_DIV_MEMBERS;
  NODE_INPUT_SEARCH;
  NODE_NO_RESULTS;
  NODE_LIST_SEARCH;
  NODE_BUTTON_CREATE;

  CHATROOM_ID;

  static observedAttributes = ["chatroom-id"];

  constructor() {
    super();

    this.innerHTML = 
    `
    <div id="modal-chatroom-setting" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">聊天室設定</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <nav id="level-chatroom-members" class="level mb-4">
            <div class="level-left">
              <div class="level-item"><lable class="label">聊天室成員</lable></div>
            </div>
          </nav>
          <nav id="level-chatroom-name" class="level mb-4">
            <div class="level-left">
              <div class="level-item"><lable class="label">聊天室名稱</lable><span class="ml-4 mb-2 _chatroom_name"></span></div>
            </div>
            <div class="level-right">
              <div class="level-item"><button class="button _save_name is-success is-light" disabled>儲存</button></div>
              <div class="level-item"><button class="button _edit_chatroom_name is-info is-light">編輯</button></div>
            </div>
          </nav>
            
          <nav id="level-exit-chatroom" class="level mb-4">
            <div class="level-left">
              <div class="level-item"><lable class="label">退出聊天室</lable></div>
            </div>
            <div class="level-right">
              <div class="level-item"><button class="button _exit_chatroom is-danger is-light">退出</button></div>
            </div>
          </nav>  
         
          <lable class="label">加入新的成員</lable>
          <div class="field is-grouped is-grouped-multiline _chatroom_members">
          </div>
          <div class="field">
            <label class="label">搜尋</label>
            <div class="control">
              <input
                class="input is-info"
                type="text"
                placeholder="會員暱稱或名字"
                id="ipt-search-text"
              />
            </div>
          </div>
          <div class="menu">
            <p style="display: none">沒有搜尋結果</p>
            <ul class="menu-list _search_results">
            </ul>
            <span class="icon is-large _search_loading" style="display: none">
              <i class="fas fa-2x fa-spinner fa-pulse"></i>
            </span>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-info _add_chatmember">
          <span>
            加入
          </span>
          </button>
          <button class="button _modal_cancel">關閉</button>
        </footer>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
    `;

    this.NODE_DIV_MEMBERS = this.querySelector("div._chatroom_members");
    this.NODE_INPUT_SEARCH = this.querySelector("#ipt-search-text");
    this.NODE_BUTTON_ADD = this.querySelector("button._add_chatmember");
    this.NODE_LIST_SEARCH = this.querySelector("ul._search_results");
    this.NODE_NO_RESULTS = this.querySelector("div.menu p");
    const node_button_exit = this.querySelector('button._exit_chatroom');
    const node_button_edit_chatroom_name = this.querySelector('button._edit_chatroom_name');
    const node_button_save = this.querySelector('button._save_name');
    const node_span_name = this.querySelector('span._chatroom_name');

    // 退出
    node_button_exit.addEventListener('click', (event) => {
      this.exitChatroom(specifier_id, this.CHATROOM_ID);
    });
    // 搜尋會員
    this.NODE_INPUT_SEARCH.addEventListener("input", debounce(this.onInputChange, 1500));
    // 加入新成員
    this.NODE_BUTTON_ADD.addEventListener("click", (event) => {
      this.NODE_BUTTON_ADD.classList.add("is-loading");
      let members = this.NODE_DIV_MEMBERS.querySelectorAll(`a[class="tag is-info is-light"]`);
      let arr = [];
      for (const member of members) {
        arr.push(member.getAttribute("data-id"));
      }
      if (arr.length == 0) {
        alert("沒有選擇任何成員！");
        this.NODE_BUTTON_ADD.classList.remove("is-loading");
      } else {
        this.addNewMember(arr, this.CHATROOM_ID);
        }
      }
      
    );
    // 編輯聊天室名字
    node_button_edit_chatroom_name.addEventListener('click', (event) => {
      node_span_name.contentEditable = true;
      node_button_save.disabled = false;
      event.target.disabled = true;
    });
    // 儲存新的聊天室名字
    node_button_save.addEventListener('click', (event) => {
      // node_span_name.contentEditable = false;
      // node_button_edit_chatroom_name.disabled = false;
      // event.target.disabled = true;
      let name = node_span_name.textContent;
      fetch(`${API_ROOT}${API_CHAT}?new_name=${name}&chatroom_id=${this.CHATROOM_ID}`, requestMethod('PUT'));
      location.reload();
    });

  }

  attributeChangedCallback(attr, prev, curr) {
    switch (attr) {
      case "chatroom-id":
        const chatroomId = this.getAttribute("chatroom-id")
        if (chatroomId == '') return;
        this.querySelector("span.ml-4.mb-2._chatroom_name").textContent = document.querySelector(`chatroom-component[chatroom-id="${chatroomId}"]`).getAttribute("chatroom-name");
        this.CHATROOM_ID = chatroomId;
        fetch(`${API_ROOT}${API_CHAT_MEMBER}?action=chatroom_member&chatroom_id=${chatroomId}`)
          .then((res) => res.json())
          .then(body => {
            const members = body.dataList;
            members.forEach(m => {
              if (m.id != specifier_id) {
                let newItem = document.createElement("span");
                newItem.classList.add("ml-4");
                newItem.classList.add("mb-2");
                newItem.textContent = m.username;
                this.querySelector('nav#level-chatroom-members .level-left .level-item').append(newItem);
              }
            })
          });
        break;
    }
  }

  exitChatroom(memberId, chatroomId) {
    if(!confirm('注意：退出聊天室將無法再看到過去訊息，是否繼續？')) return;
    fetch(`${API_ROOT}${API_CHAT_MEMBER}?member_id=${memberId}&chatroom_id=${chatroomId}`, requestMethod('DELETE'))
      .then(response => response.text())
      .then(result => {
        console.log(result);
        location.reload();
      })
      .catch(error => console.log('error', error));
  }

  addNewMember(arrayOfMembersId, chatroomId) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(arrayOfMembersId),
      redirect: 'follow'
    };

    fetch(API_ROOT + API_CHAT_MEMBER + `?chatroom_id=${chatroomId}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        // let resultText = result === "true" ? "成功加入新成員" : "加入失敗；請選擇其他會員";
        // confirm(resultText);

        // this.NODE_BUTTON_ADD.classList.remove("is-loading");
        // closeAllModals();
        location.reload();
      })
      .catch(error => {
        this.NODE_BUTTON_ADD.classList.remove("is-loading");
        // console.log('error', error);
        alert("所選會員已存在，請重新選擇");
        return false;
      });
  }

}


// 建立聊天室的 Modal
class CreateChatroomModal extends SearchFromInput {

  NODE_DIV_MEMBERS;
  NODE_INPUT_SEARCH;
  NODE_NO_RESULTS;
  NODE_LIST_SEARCH;
  NODE_BUTTON_CREATE;

  constructor() {
    super();
    this.innerHTML = 
    `
    <div id="modal-new-chatroom" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">建立新聊天室</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <lable class="label">選擇加入聊天室的會員</lable>
          <div class="field is-grouped is-grouped-multiline _chatroom_members">
          </div>
          <div class="field">
            <label class="label">搜尋</label>
            <div class="control">
              <input
                class="input is-info"
                type="text"
                placeholder="會員暱稱或名字"
                id="ipt-search-text"
              />
            </div>
          </div>
          <div class="menu">
            <p style="display: none">沒有搜尋結果</p>
            <ul class="menu-list _search_results">
            </ul>
            <span class="icon is-large _search_loading" style="display: none">
              <i class="fas fa-2x fa-spinner fa-pulse"></i>
            </span>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-info _create_chatroom">
          <span>
            建立
          </span>
          </button>
          <button class="button _modal_cancel">取消</button>
        </footer>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
    `;

    this.NODE_DIV_MEMBERS = this.querySelector("div._chatroom_members");
    this.NODE_INPUT_SEARCH = this.querySelector("#ipt-search-text");
    this.NODE_BUTTON_CREATE = this.querySelector("button._create_chatroom");
    this.NODE_LIST_SEARCH = this.querySelector("ul._search_results");
    this.NODE_NO_RESULTS = this.querySelector("div.menu p");

    this.NODE_INPUT_SEARCH.addEventListener("input", debounce(this.onInputChange, 1500));
    this.NODE_BUTTON_CREATE.addEventListener("click", (event) => {
      this.NODE_BUTTON_CREATE.classList.add("is-loading");
      let members = this.NODE_DIV_MEMBERS.querySelectorAll(`a[class="tag is-info is-light"]`);
      let arr = [];
      for (const member of members) {
        arr.push(member.getAttribute("data-id"));
      }
      if (arr.length == 0) {
        alert("沒有選擇任何成員！");
        this.NODE_BUTTON_CREATE.classList.remove("is-loading");
      } else {
        arr.push(specifier_id);
        this.createChatroom(arr, this.CHATROOM_ID);
        }
      }
      
    );

  }

  createChatroom(arrayOfMembersId) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(arrayOfMembersId),
      redirect: 'follow'
    };

    fetch(API_ROOT + API_CHAT, requestOptions)
      .then(response => response.json())
      .then(chatroom => {
        let resultText = chatroom.id != undefined ? "成功建立聊天室" : "成員間已有共同的聊天室";
        confirm(resultText);

        // const list = document.querySelector("ul._chatroom_list");
        // let newItem = document.createElement("chatroom-component");
        // newItem = prepareAttributes(newItem, chatroom, "chatroom");
        // list.append(newItem);

        this.NODE_BUTTON_CREATE.classList.remove("is-loading");
        closeAllModals();
      })
      .catch(error => {
        this.NODE_BUTTON_CREATE.classList.remove("is-loading");
        console.log('error', error);
        alert("發生錯誤，請重新執行");
        return false;
      });
  }

}

customElements.define("chatroom-component", Chatroom);
customElements.define("chatlog-side-component", ChatLogSide);
customElements.define("chatlog-area-component", ChatLogArea);
customElements.define("msg-self", SelfMessage);
customElements.define("msg-other", OtherMessage);
customElements.define("chatroom-setting-modal", ChatroomSettingModal);
customElements.define("create-chatroom-modal", CreateChatroomModal);