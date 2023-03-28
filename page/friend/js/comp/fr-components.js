// 結果卡片元件 ResultCard
class ResultCard extends HTMLElement {

  card_html;
  id;
  name;
  username;

  constructor() {
    super();
  }

  buildCard(button_html) {
    // src="https://bulma.io/images/placeholders/96x96.png"
    this.card_html = `
    <div class="card mb-6 mx-6">
      <div class="card-content">

        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img
                src="${API_ROOT}${API_IMG_AVATAR}?member_id=${this.id}"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="media-content">

            <div class="columns">
              <div class="column is-one-third">
                <div class="content">
                  <a href="${API_ROOT}/page/member/other.html?member_id=${this.id}">
                    <span class="title is-4">${this.username}</span>
                    <span class="subtitle is-6">&nbsp;&nbsp;&nbsp;&nbsp;${this.name}</span><br>
                    <p class="subtitle is-6">${this.getAttribute("member-account")}</p>
                  </a>
                </div>
              </div>              
            </div>
        
          </div>
          <div class="media-right">
            ${button_html}      
          </div>
      </div>

    </div>
  `;
  }

  setMemberProperties() {
    this.id = this.getAttribute("member-id");
    this.name = this.getAttribute("member-name") == null ? this.getAttribute("member-username") : this.getAttribute("member-name");
    this.username = this.getAttribute("member-username") == null ? this.getAttribute("member-name") : this.getAttribute("member-username");
  }

  toastActionResult(colorType, resultText) {
    bulmaToast.toast({
      message: `<h1><b>${resultText}</b></h1>`,
      type: colorType,
      position: "top-right",
      offsetTop: "55px",
      dismissible: true,
      pauseOnHover: true,
      duration: 3000,
      animate: { in: 'fadeIn', out: 'fadeOut' },
    });
  }

}

// 你可能感興趣 Suggestion
class Suggestion extends ResultCard {

  
  constructor() {
    super();
  }

  connectedCallback() {
    this.setMemberProperties();
    this.buildCard(
      `
      <div class="buttons are-medium">
        <button class="_add_friend button ${PRIMARY_LIGHT} has-text-weight-bold">
          <span class="icon is-small"><i class="fas fa-user-group"></i></span>
          <span>加為好友</span>
        </button> 
        </button>
        <button class="_block button ${DANGER_LIGHT} has-text-weight-bold">
          <span class="icon is-small"><i class="fas fa-ban"></i></span>
          <span>封鎖</span> 
        </button> 
      </div>  
      `
    );

    this.innerHTML = this.card_html;

    this.querySelector("button._add_friend").addEventListener("click", (event) => {
      let other_id = event.target.closest("suggestion-component").getAttribute("member-id");
      if(!confirm("確認邀請？")) return;
      addRequest(specifier_id, other_id);
      this.toastActionResult(PRIMARY, `你已對 ${this.username} 提出好友邀請`);
      this.remove();
    });

    this.querySelector("button._block").addEventListener("click", (event) => {
      let other_id = event.target.closest("suggestion-component").getAttribute("member-id");
      if(!confirm("確認封鎖對方？")) return;
      block(other_id);
      this.toastActionResult(DANGER, `你已封鎖 ${this.username}`);
      this.remove();
    });
    
  }

}

// 好友 Friend
class Friend extends ResultCard {

  member_status;

  // static observedAttributes = ["member-status"];

  constructor() {
    super();
  }

  connectedCallback() {
    this.setMemberProperties();
    this.buildCard(
      `
      <div class="buttons are-medium">
        <button class="_ring button ${PRIMARY_LIGHT} has-text-weight-bold">
          <span class="icon is-small"><i class="fas fa-bell"></i></span>
          <span>噹噹噹</span> 
        </button>
        <button class="_unfriend button ${INFO_LIGHT} has-text-weight-bold">
          <span class="icon is-small"><i class="fas fa-minus"></i></span>
          <span>解除好友</span> 
        </button> 
      </div> 
      `
    );

    this.innerHTML = this.card_html;

    this.querySelector("button._ring").addEventListener('click', (event) => {
      let other_id = event.target.closest("friend-component").getAttribute("member-id");
      if (!this.hasAttribute("member-online")) {
        alert("這位好友未上線");
        return;
      }
      const ring = {memberId: other_id, updateType: "ring", status: specifier_username};
      notification_ws.send(JSON.stringify(ring));
    });

    this.querySelector("button._unfriend").addEventListener("click", (event) => {
      let other_id = event.target.closest("friend-component").getAttribute("member-id");
      if(!confirm("確認解除好友？")) return;
      unfriend(other_id);
      this.toastActionResult(INFO, `你跟 ${this.username} 已解除好友`);
      this.remove();
    });

    this.requestStatus(this.id);
  }

  requestStatus(memberId) {
    const request = {memberId: memberId, updateType: "request"};
    notification_ws.send(JSON.stringify(request));
  }

}

// 送出邀請 SentRequest
class SentRequest extends ResultCard {

  constructor() {
    super();
  }

  connectedCallback() {
    this.setMemberProperties();
    this.buildCard(
      `
      <div class="buttons are-medium">
        <button class="_cancel button ${WARNING_LIGHT} has-text-weight-bold">
          <span class="icon is-small"><i class="fas fa-xmark"></i></span>
          <span>取消</span>
        </button>
      <div>
      `
    );

    this.innerHTML = this.card_html;

    this.querySelector("button._cancel").addEventListener("click", (event) => {
      let other_id = event.target.closest("sent-request-component").getAttribute("member-id");
      if(!confirm("確認取消？")) return;
      cancelRequest(other_id);
      this.toastActionResult(WARNING, `你已取消對 ${this.username} 的好友邀請`);
      this.remove();
    });
  }

}

// 收到邀請 ReceivedRequest
class ReceivedRequest extends ResultCard {

  constructor() {
    super();
  }
  connectedCallback() {
    this.setMemberProperties();
    this.buildCard(
      `
        <div class="buttons are-medium">
          <button class="_accept button ${SUCCESS_LIGHT} has-text-weight-bold">
            <span class="icon is-small"><i class="fas fa-check"></i></span>
            <span>接受</span>
          </button>
          <button class="_decline button ${WARNING_LIGHT} has-text-weight-bold">
            <span class="icon is-small"><i class="fas fa-xmark"></i></span>
            <span>婉拒</span>
          </button>
          <button class="_block button ${DANGER_LIGHT} has-text-weight-bold">
            <span class="icon is-small"><i class="fas fa-ban"></i></span>
            <span>封鎖</span>
          </button>   
        </div>     
      `
    )

    this.innerHTML = this.card_html;

    this.querySelector("button._accept").addEventListener("click", (event) => {
      let other_id = event.target.closest("received-request-component").getAttribute("member-id");
      if(!confirm("確認接受？")) return;
      acceptRequest(other_id);
      this.toastActionResult(SUCCESS, `你已接受 ${this.username} 的好友邀請`);
      this.remove();
    });

    this.querySelector("button._decline").addEventListener("click", (event) => {
      let other_id = event.target.closest("received-request-component").getAttribute("member-id");
      if(!confirm("確認婉拒？")) return;
      declineRequest(other_id);
      this.toastActionResult(WARNING, `你已婉拒 ${this.username} 的好友邀請`);
      this.remove();
    });

    this.querySelector("button._block").addEventListener("click", (event) => {
      let other_id = event.target.closest("received-request-component").getAttribute("member-id");
      if(!confirm("確認封鎖對方？")) return;
      block(other_id);
      this.toastActionResult(DANGER, `你已封鎖 ${this.username}`);
      this.remove();
    });
  }

}

// 封鎖名單 Blocklist
class Blocklist extends ResultCard {

  constructor() {
    super();
  }

  connectedCallback() {
    this.setMemberProperties();
    this.buildCard(
      `
      <div class="buttons are-medium">
        <button class="_unfriend button is-info is-light has-text-weight-bold">
          <span class="icon is-small"><i class="fas fa-minus"></i></span>
          <span>解除封鎖</span> 
        </button> 
      </div> 
      `
    );

    this.innerHTML = this.card_html;

    this.querySelector("button._unfriend").addEventListener("click", (event) => {
      let other_id = event.target.closest("blocklist-component").getAttribute("member-id");
      if(!confirm("確認解除封鎖？")) return;
      unblock(other_id);
      this.toastActionResult(DANGER, `你已解除對 ${this.username} 的封鎖`);
      this.remove();
    });
  }

}

customElements.define('suggestion-component', Suggestion);
customElements.define('friend-component', Friend);
customElements.define('sent-request-component', SentRequest);
customElements.define('received-request-component', ReceivedRequest);
customElements.define('blocklist-component', Blocklist);