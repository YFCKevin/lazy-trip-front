// 自訂一些共用的 UI 元件，頁面只要引進這份 js 檔，即可使用
// 用法：在適合的位置加入 <header-component></header-component>
// 參考來源：https://www.freecodecamp.org/news/reusable-html-components-how-to-reuse-a-header-and-footer-on-a-website/

// 頁首 Header (置頂導覽列)

class Header extends HTMLElement {
   constructor() {
    super();
    let loc = window.location;
    const ORIGIN = loc.origin;

  this.header_html = `
    <nav
    class="navbar has-shadow"
    role="navigation"
    aria-label="main navigation"
    >
    <!-- Logo -->
    <div class="navbar-brand">
      <a id="navbar-logo-area" class="navbar-item has-text-primary" href="http://localhost:8080/lazy-trip-back/index.html">
        &nbsp;
        <span class="icon has-text-primary">
        <i class="fas fa-mountain-sun"></i> 
        </span>
        &nbsp;&nbsp;
        <span class="icon has-text-primary">
          <i class="fas fa-l"></i> 
        </span>
        <span class="icon has-text-primary">
          <i class="fas fa-a"></i> 
        </span>
        <span class="icon has-text-primary">
          <i class="fas fa-z"></i> 
        </span>
        <span class="icon has-text-primary">
          <i class="fas fa-y"></i> 
        </span>
        &nbsp;<b>&bull;</b>&nbsp;
        <span class="icon has-text-primary">
          <i class="fas fa-t"></i> 
        </span>
        <span class="icon has-text-primary">
          <i class="fas fa-r"></i> 
        </span>
        <span class="icon has-text-primary">
          <i class="fas fa-i"></i> 
        </span>
        <span class="icon has-text-primary">
          <i class="fas fa-p"></i> 
        </span>  
      </a>

      <!-- 當畫面尺寸夠小時顯示為 navbar burger -->
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <!-- 靠左 -->
      <div class="navbar-start"></div>

      <!-- 靠右 -->
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-item">
            <span class="icon"><i class="fas fa-plus"></i></span>
          </a>
          <div class="navbar-dropdown">
            <a class="navbar-item"> 新的行程 </a>
            <a href="/lazy-trip-back/page/group/group_htmls/new_group.html" class="navbar-item"> 新的揪團 </a>
          </div>
        </div>

        <a href="${ORIGIN}/lazy-trip-back/page/tour/tour_company.html" class="navbar-item"> 行程 </a>
        <div class="navbar-item has-dropdown is-hoverable member">
          <a class="navbar-item mem_main">
            <span class="icon-text">
              <span class="icon">
                <i class="fas fa-user"></i>
              </span>
              <span class="username">周杰倫</span>
            </span>
          </a>
          <div class="navbar-dropdown">
            <a class="navbar-item company_logout"> 登出 </a>
          </div>
        </div>
      </div>
    </div>
    </nav>`;
   }
  

  connectedCallback() {
    this.innerHTML = this.header_html;
    $(document).on("click", "a.mem_main", function () {
      let ori = location.origin;
      location.href = ori + "/lazy-trip-back/page/company/roomManagement.html";
    });
    $(function () {
      // Function-----------------
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      //   ---------------
      let companyName = getCookie("companyUsername");
      let location = window.location.origin;
      if (companyName != null) {
        $("span.username").text(companyName);
      } else {
        let html = `
        <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary" href="${location}/lazy-trip-back/page/signup.html">
            <strong> 註冊 </strong>
          </a>
          <a class="button is-light" href="${location}/lazy-trip-back/page/login.html"> 登入 </a>
        </div>
      </div>`;
        $("div.member").empty();
        $("div.member").append(html);
      }
    });
  }
}

// 頁尾 Footer
class Footer extends HTMLElement {
  footer_html = `
    <footer class="footer">
      <div class="columns">
        <div class="column">
          <div class="content">
            <h4>關於</h4>
            <p>
              <strong>LazyTrip.io</strong> 由 緯育 Java 雲端服務開發技術養成班
              TGA105 梯第三組所製作之結訓專題。
            </p>
          </div>
        </div>
        <div class="column">
          <div class="content">
            <h4>用戶前台</h4>
            <a href="#">首頁</a>
          </div>
        </div>
      </div>
    </footer>`;

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this.footer_html;
  }
}

// 測試用
class Example extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => {
      console.log(`Hello ${this.getAttribute("foo")}`);
    });
  }

  connectedCallback() {
    this.innerHTML = `<button class='button is-info is-outlined'>${this.textContent}</button>`;
  }
}

customElements.define("header-component", Header);
customElements.define("footer-component", Footer);
customElements.define("example-component", Example);