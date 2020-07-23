const menubtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
const btnBranding = document.querySelector('.menu-branding');
const main = document.querySelector('#home');
const about = document.querySelector('#about');
const work = document.querySelector('#work');
const NavItem = document.querySelectorAll('.nav-item');

let ShowMenu = false;
menubtn.addEventListener('click', toggleMenu);


function toggleMenu() {
  if (!ShowMenu) {
    menubtn.classList.add('close');
    menu.classList.add('show');
    menuNav.classList.add('show');
    btnBranding.classList.add('show');
    if(main) {
      main.classList.add('index');
    } else if (about) {
      about.classList.add('index');
    } else if (work) {
      work.classList.add('index');
    }
    NavItem.forEach(item => {
      item.classList.add('show');
    });
    ShowMenu = true;
  } else {
    menubtn.classList.remove('close');
    menu.classList.remove('show');
    menuNav.classList.remove('show');
    btnBranding.classList.remove('show');
    if(main) {
      main.classList.remove('index');
    } else  if(about) {
      about.classList.remove('index');
    } else  if(work) {
      work.classList.remove('index');
    }
    NavItem.forEach(item => {
      item.classList.remove('show');
    });
    ShowMenu = false  ;
  }
}