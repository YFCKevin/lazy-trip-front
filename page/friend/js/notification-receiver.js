class Observable {

  subject; // Map <會員編號, 共同聊天室編號陣列>，一開始建立後，持續接受來自 server 的更新，但不是 chatroom 的判斷依據
  activeChatrooms; // 將 subject 轉化成所有目前有人上線的之此會員的聊天室編號 Set，chatroom 根據它的 id 是否存在這個 Set 裡來判斷是否為 active
  observers; // 觀察者，建立於每一個 chatroom-component 內

  constructor(subject) {
    this.subject = subject;
    this.observers = [];
  }

  // 觀察者訂閱受觀察來源，加入後再加一次即為退出
  add(observer) {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(o => o !== observer);
    };
  }

  // 通知所 chatroom-component 的觀察者來依據 activeChatrooms 更新狀態
  notify() {
    // let arr = [];
    // this.subject.forEach( value => arr.push(value));
    // let activeChatroomsSet = new Set(arr.flatMap(e => e));
    this.observers.forEach(observer => observer.update(this.activeChatrooms));
  }

  // 一開始會員連線時，載入那一刻的其他上線中會員和其共同聊天室的資料
  setSubject(subject) {
    this.subject = subject;
  }

  // 建立連線後，每次接受 server 的推播來更新 subject 內容：某一位其他會員的上線或下線
  updateSubject(data) {
    if(data.status == "online") {
      this.subject.set(data.memberId, data.commonChatroomsId);
    } else if (data.status == "offline") {
      this.subject.delete(data.memberId);
    }
    this.updateChatroomsFromSubject();
  }

  getSubject() {
    return this.subject;
  }

  // 將 subject 轉換為 activeChatrooms，即觀察者真正關心的對象
  updateChatroomsFromSubject() {
    let arr = [];
    // 將所有共同聊天室編號陣列集中到一個陣列內 (變二維)
    this.subject.forEach( value => arr.push(value));
    // 將二維陣列扁平化，聊天室編號集中到一個 Set 以排除重複
    this.activeChatrooms = new Set(arr.flatMap(e => e));
  }

}

// chatroom-component 裡建立一個觀察者，觀察
class Observer {

  chatroom_id;

  constructor(chatroom_id) {
    this.chatroom_id = parseInt(chatroom_id);
  }

  // 更新本聊天室是否除使用者本人外，至少一個人上線中
  update(activeChatrooms) {
    if (activeChatrooms.has(this.chatroom_id)) {
      document.querySelector(`chatroom-component[chatroom-id="${this.chatroom_id}"]`).setAttribute("chatroom-active", "true");
    } else {
      document.querySelector(`chatroom-component[chatroom-id="${this.chatroom_id}"]`).setAttribute("chatroom-active", "false");
    }
  }
}

let chatMembersObservable = new Observable();

const notification_ws = new WebSocket(`${WS_ROOT}/notification-ws/${specifier_id}`);

notification_ws.onopen = (event) => {
  console.log("成功連線到 notification-ws")
};

notification_ws.onmessage = (event) => {
  const newStatus = JSON.parse(event.data);

  if (newStatus.updateType == "response") {
    const friend = document.querySelector(`friend-component[member-id="${newStatus.memberId}"]`);
    if (friend != undefined) {
      if(newStatus.status == 'offline') return;
      friend.setAttribute("member-online", "true");
      let span = document.createElement("span");
      span.innerHTML = '<i class="fas fa-circle"></i>';
      span.classList.add("has-text-success");
      friend.querySelector('div.columns div.is-one-third div.content a').append(span);
    }
  }

  if(newStatus.updateType == "ring") {
    const colorArr = ["is-primary", "is-link", "is-info", "is-warning", "is-danger", "is-success"];
    let index = Math.floor(Math.random() * 6);
    bulmaToast.toast({
      message: `<h1><b>${newStatus.status}</b></h1>`,
      type: colorArr[index],
      position: "top-right",
      offsetTop: "55px",
      dismissible: true,
      pauseOnHover: true,
      duration: 2000,
      animate: { in: 'fadeIn', out: 'fadeOut' },
    });
  }
 
  if (newStatus.status == "online-batch") {
    let map = new Map();
    for (let key of Object.keys(newStatus.onlineMembers)) {
      // 將 上線中會員：共同聊天室 list 存入 map
      map.set(parseInt(key), newStatus.onlineMembers[key]);
    }
    chatMembersObservable.setSubject(map);
    chatMembersObservable.updateChatroomsFromSubject();
  } else if (newStatus.updateType == "server-push") {
    chatMembersObservable.updateSubject(newStatus);
    chatMembersObservable.notify();
  }
  
};
