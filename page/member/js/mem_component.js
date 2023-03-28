class Card extends HTMLElement {
  CARD_NAME;
  // CARD_URL;

  constructor() {
    super();
  }

  connectedCallback() {
    this.CARD_NAME = this.getAttribute("data-name");
    // this.CARD_URL = this.getAttribute("data-url");
    this.innerHTML = `
    <div class="card mb-4">
    <header class="card-header">
      <div class="media-content card-header-title">
          <figure class="image is-48x48 mr-3">
          
          </figure>
          <span class="title is-5  mem_username">A 
            <p class="mt-3 is-size-6 post-time" style="color: #949494;"></p>
          </span>
      </div>

      <button class="card-header-icon" aria-label="more options">
          <span class="icon">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
      </button>
    </header>
    <div class="card-image">
      <figure class="image is-4by3 slideshow">
      <a class="prev">&lt;</a>
      <a class="next">&gt;</a>
        
        
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
          <div class="media-left"></div>
      </div>

      <div class="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus nec iaculis mauris. <a>@bulmaio</a>.
          <a href="#">#css</a> <a href="#">#responsive</a>
          <br />
          
      </div>
    </div>
  </div>
    `;
  }
}

customElements.define("card-component", Card);
