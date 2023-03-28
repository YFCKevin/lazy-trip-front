class ControlPanel extends HTMLElement {

  // Attribute control-target: suggestion, friend, sent-request, received-request, chatroom

  #RESULTS_FILTER_HTML = 
    `
    <div class="control mr-4 has-icons-left">
      <div class="select">
        <select class="_sort_column">
          <option>會員帳號</option>
          <option>會員姓名</option>
          <option>會員暱稱</option>
        </select>
      </div>
      <div class="icon is-small is-left">
        <i class="fas fa-sort"></i>
      </div>
    </div>
    <div class="select">
      <select class="_sort_order">
        <option>升冪</option>
        <option>降冪</option>
      </select>
    </div>
    `;

  #CHAT_CONTROL_HTML = 
    `
    <button class="button is-outlined is-success js-modal-trigger" data-target="modal-new-chatroom">
      <span class="icon is-clickable">
        <i class="fas fa-user-group"></i>
      </span>
      <span><b>新聊天室</b><span>
    </button>
    `;

  static observedAttributes = ["control-target"];

  constructor() {
    super();
    this.innerHTML = 
      `
      <nav class="level pt-6 px-6">
                  <div class="level-left">
                    <div class="level-item">
                      <!-- 搜尋框 -->
                      <div class="field has-addons">
                        <p class="control">
                          <input class="input _search" type="text" placeholder="根據會員暱稱" />
                        </p>
                        <p class="control">
                          <button class="button _search">
                            搜尋感興趣的會員
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="level-right">
                    <div class="level-item">
                      ${this.#RESULTS_FILTER_HTML}
                    </div>          
                  </div>
                </nav>
      `;

      this.querySelector('button._search').addEventListener('click', (event) => {
        observer.unobserve(node_footer);
        content_row_count = 0;
        existMoreData = true;
        showContent(this.getAttribute("control-target"));
      })
  }

  attributeChangedCallback(attr, prev, curr) {
    let node_right_part =  document.querySelector("control-panel-component div.level-right div.level-item");
    switch (attr) {
      case "control-target":
        switch (curr) {
          case TYPE_SUGGESTION:
            updateSearchButton("搜尋感興趣的會員"); 
            if (prev == TYPE_CHATROOM) node_right_part.innerHTML = this.#RESULTS_FILTER_HTML;
            break;
          case TYPE_FRIEND:
            updateSearchButton("搜尋好友");
            if (prev == TYPE_CHATROOM) node_right_part.innerHTML = this.#RESULTS_FILTER_HTML;
            break;
          case TYPE_SENT_REQUEST:
            updateSearchButton("搜尋送出邀請");
            if (prev == TYPE_CHATROOM) node_right_part.innerHTML = this.#RESULTS_FILTER_HTML;
            break;
          case TYPE_RECEIVED_REQUEST:
            updateSearchButton("搜尋收到邀請");
            if (prev == TYPE_CHATROOM) node_right_part.innerHTML = this.#RESULTS_FILTER_HTML;
            break;
          case TYPE_BLOCKLIST:
            updateSearchButton("搜尋封鎖名單");
            if (prev == TYPE_CHATROOM) node_right_part.innerHTML = this.#RESULTS_FILTER_HTML;
            break;
          case TYPE_CHATROOM:
            updateSearchButton("搜尋聊天室");
            document.querySelector("control-panel-component div.level-right div.level-item").innerHTML = this.#CHAT_CONTROL_HTML;
            const $trigger = document.querySelector(`button[data-target="modal-new-chatroom"]`);
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);

            $trigger.addEventListener("click", () => {
              openModal($target);
            });
            break;
        }
        break;
    }

    function updateSearchButton(newText) {
      document.querySelector("control-panel-component div.level-left p.control button").textContent = newText;
    }
  }

  getSortingColumn() {
    let val; 
    switch (this.querySelector("select._sort_column").value) {
      case '會員暱稱':
        val = 'member_username';
        break;
      case '會員姓名':
        val = 'member_name';
        break;
      case '會員帳號':
        val = 'member_account';
        break;
    }
    return val;
  }

  getSortingOrder() { 
    if (this.querySelector("select._sort_order").value == '升冪') {
      return 'ASC';
    } else {
      return 'DESC';
    }
  }

  getSearchText() {
    const text = this.querySelector("input._search").value;
    const val = text == undefined ? "" : text;
    return val;
  }

}

customElements.define("control-panel-component", ControlPanel);