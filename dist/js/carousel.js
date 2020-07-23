class Carousel {

  /**
   * @callback moveCallback;
   * @param {number} index
   */

  /**
   * @param { HTMLElement } element
   * @param {object}options
   * @param {object} {options.slideToScroll=1} Nombre element a scroll
   * @param {object} {options.slidesvisible=1} Nombre element visible a scroll
   * @param {boolean} {options.loop=false} marque le bouton - Doit-t-on boucle en finir de listes
   * @param {boolean} {options.pagination=false}
   * @param {boolean} {options.navigation=true}
   */
  constructor (element, options = {}) {
      this.element = element;
      // use Assign pour eviste que en absence de un elements
      this.options = Object.assign({},{
          slideToScroll: 1,
          slidesvisible: 1,
          loop: false,
          pagination: false,
          navigation: true
      }, options);

      // convertir un NodeList en liste de array
      let children = [].slice.call(element.children);

      //  determiner si cest une mobile ou pas
      this.isMobile = false;
      this.MoveCallbacks = []
      // pour gerer les slides
      this.currentItem = 0;
      // Modification du DOM
      this.root = Carousel.createDivWithClass('carousel');
      this.container = Carousel.createDivWithClass('carousel__container');
      this.root.appendChild(this.container);
      this.element.appendChild(this.root);
      this.root.setAttribute('tabindex', '0')
      

      // place tous les enfants dans carousel
      this.items = children.map((child) => {
          //contenir les enfants dans une div
          let item = Carousel.createDivWithClass('carousel__item');
          item.appendChild(child);
          this.container.appendChild(item);
          return item;
      });

      if(this.options.navigation){
          this.createNavigation();
      }
      
      if(this.options.pagination){
          this.createPagination();
      }

      this.setStyle();
      
      // Evenervements
      // determiner l"items sur les quelles on ce trouver
      this.MoveCallbacks.forEach(cb => cb(0))
      // redimensionner en fonctionner de la taille du fénetre
      this.onWindowsResize();
      window.addEventListener('resize', this.onWindowsResize.bind(this))
      this.root.addEventListener('keyup', e => {
          if(e.key === 'ArrowRight' || e.key === 'Right'){
              this.next();
          } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
              this.prev();
          }
      })
      this.OnScroll();
  }

  /**
   * redimension les items
   */
    setStyle () {
      // pour determiner la largeur des items a display
      let ratio = this.items.length / this.slidesVisible;
      // ajout les diff haut au items
      this.container.style.width = (ratio * 100) + "%";
      this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%");
    }

  /**
   * creer les button
   */
  createNavigation () {
  let nextButton = Carousel.createDivWithClass('carousel__next');
  let prevButton = Carousel.createDivWithClass('carousel__prev');
      this.root.appendChild(nextButton);
      this.root.appendChild(prevButton);
      nextButton.addEventListener('click', this.next.bind(this));
      prevButton.addEventListener('click', this.prev.bind(this));
      if(this.options.loop === true) {
          return
      }
      this.onMove(index => {
          if (index === 0) {
              prevButton.classList.add('carousel__prev__hidden')
          } else {
              prevButton.classList.remove('carousel__prev__hidden')
          }

          if(this.items[this.currentItem + this.slidesVisible] === undefined){
              nextButton.classList.add('carousel__next__hidden')
          } else {
              nextButton.classList.remove('carousel__next__hidden')
          }
      })
  }

  /**
   * creer les button de pagination
   */
  createPagination () {
      let pagination = Carousel.createDivWithClass('carousel__pagination');
      let buttons = []
      this.root.appendChild(pagination);

      for (let i = 0; i < this.items.length; i = i + this.options.slideToScroll){
          let button = Carousel.createDivWithClass('carousel__pagination__button')
          button.addEventListener('click',() => this.gotoItem(i))
          pagination.appendChild(button)
          buttons.push(button);
      }
      
      this.onMove(index => {
          let ActiveButton = buttons[Math.floor(index / this.options.slideToScroll)];
          if (ActiveButton){
              buttons.forEach(button => button.classList.remove('carousel__pagination__button__active'))
              ActiveButton.classList.add('carousel__pagination__button__active')
          }
      })
  }

  /**
   * buttonn pour passe a etapes suivrante
   */
  next () {
      this.gotoItem(this.currentItem + this.slideToScroll)
  }

  /**
   * button pour passe a etapes preccedent
   */
  prev () {
      this.gotoItem(this.currentItem - this.slideToScroll)
  }

  //scroll the left of right
  OnScroll(){
      setInterval(()=>{
          if(this.options.loop === true) {
              this.gotoItem(this.currentItem + this.slideToScroll)
          } else {
              return
          }
      }, 1000 * 5);
  }

  /**
   * sa deplacer le carousel vers element cible
   * @param {number} index
   */
  gotoItem(index){
      if (index < 0) {
          if(this.options.loop){
              index = this.items.length - this.slidesVisible
          } else {
             return; 
          }
      } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
          if (this.options.loop) {
              index = 0
          } else {
              return;
          }
      }
      // cest negative pour une translation en arrive
      let translateX = index * -100 / this.items.length;
      this.container.style.transform = 'translate3d('+ translateX +'%,0 ,0 )';
      this.currentItem = index;
      // determiner l"items sur les quelles on ce trouver
      this.MoveCallbacks.forEach(cb => cb(index))
  }

  /**
   *
   * @param {moveCallback} cd
   */
  onMove (cd) {
      this.MoveCallbacks.push(cd);
  }

  /**
   * creer un element avec une class
   * @param {string} className
   * @Returns {HTMLElement}
  */

  static createDivWithClass (className) {
      let div = document.createElement('div');
      div.setAttribute('class', className);
      return div;
  }

  /**
  *   @returns {number}
  */

  get slideToScroll() {
      return this.isMobile ? 1 : this.options.slideToScroll;
  }

  /**
   * 
   *  @returns {number}
   */
  
  get slidesVisible() {
      return this.isMobile ? 1 : this.options.slidesvisible;
  }

  onWindowsResize () {
      let mobile = window.innerWidth < 800;
      if(mobile !== this.isMobile){
          this.isMobile = mobile;
          this.setStyle();
          this.MoveCallbacks.forEach(cb => cb(this.currentItem));
      }
  }

}

let OnReady = function () {

  new Carousel(document.querySelector('#custum-body'),{
      slidesvisible: 3,
      slideToScroll: 1,
      loop: true,
      pagination: false,
      navigation: false
  })
}

if (document.readyState !== 'loading'){
  OnReady();
}

document.addEventListener('DOMContentLoaded', OnReady);