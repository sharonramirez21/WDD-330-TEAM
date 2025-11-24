// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// param function
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const html = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, html.join(""));
}

// activity from 5 to 7
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// activity 8
export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTem = await loadTemplate(`../partials/header.html`);
  const headerElem = document.querySelector(`#header-content`);
  renderWithTemplate(headerTem, headerElem);
  
  const footerTem = await loadTemplate(`../partials/footer.html`);
  const footerElem = document.querySelector("#footer");
  renderWithTemplate(footerTem, footerElem);

  document.dispatchEvent(new Event("headerLoaded"));
}


export function alertMessage(message, scroll=true){
  const alert = document.createElement('div');
  alert.classList.add('alert');

  alert.innerHTML = `
  <p>${message}</p>
  <buttom class="alert-btn>X<buttom>
  `;

  alert.addEventListener('click', function(e) {
      if(e.target.classList.contains('alert-close')) {
        main.removeChild(this);
      }
  })
  // add the alert to the top of main
  const main = document.querySelector('main');
  main.prepend(alert);
  if(scroll)
    window.scrollTo(0,0);
}