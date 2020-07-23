class Protofolio {

  /**
  * constructeur du portofio
  * @param { HTMLElement } selector
  */
  constructor(selector) {
    this.ActiveContent = null;
    this.ActiveItem = null;
    this.container = document.querySelectorAll(selector);
    if (this.container === null) {
      throw new Error(`L'element selectionner ${selector} n'existe pas`)
    }
    this.children = Array.from(this.container[0].querySelectorAll('.js-item'))
    this.children.forEach((child) => {
      child.addEventListener('click', (e) => {
        e.preventDefault();
        this.show(child);
      })
    })
  }


  /**
   * Affiche l'element selectionner
   * @param {HTMLElment} child
   */
  show(child) {
    let offset = 0;
    if (this.ActiveContent !== null) {
      this.sliceUp(this.ActiveContent)
      if (this.ActiveContent.offsetTop < child.offsetTop) {
        offset = this.ActiveContent.offsetHeight
      }
    }

    if (this.ActiveItem === child) {
      this.ActiveContent = null;
      this.ActiveItem = null
    } else {
      let content = child.querySelector('.js-body').cloneNode(true);
      child.after(content)
      this.scrollTo(child, offset);
      this.slideDown(content);
      this.ActiveContent = content;
      this.ActiveItem = child;
    }
  }

  /**
   * Affiche l'element selectionner avec une effect animation
   * @param {HTMLElement} element
   */
  slideDown(element) {
    let heigth = element.offsetHeight
    element.style.height = '0px'
    element.style.transitionDuration = '.5s'
    element.offsetHeight
    element.style.height = heigth + 'px'
    window.setTimeout(function() {
      element.style.height = null
    }, 500)
  }

  /**
   * Masque l'element selectionner avec une effect animation
   * @param {HTMLElement} element
   */
  sliceUp(element) {
    let heigth = element.offsetHeight
    element.style.height = heigth + 'px'
    element.offsetHeight
    element.style.height = '0px'
    element.style.transitionDuration = '.5s'
    window.setTimeout(function() {
      element.parentNode.removeChild(element)
    }, 500)
  }

  /**
  * Masque l'element selectionner avec une effect animation
  * @param {HTMLElement} element
  * @param {HTMLElement} offset
  */
  scrollTo(element, offset = 0) {
    window.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: element.offsetTop - offset
    })
  }

} 


new Protofolio('#js__Portofolio');