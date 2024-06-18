// Contenedor de productos
const productsContainer = document.querySelector('.products-container');
// Boton ver mas
const showMoreBtn = document.querySelector('.btn-load');

//Contenedor de Categorias
const categotiesConteiner = document.querySelector('.categories');
//Botones de Categoria
const categotiesList = document.querySelectorAll('.category');



/* ----------- Logica para renderizar productos ----------- */
// Funcion para crear el html del producto
const createProductTemplate = (product) => {
  const {id, name, bid, user, category, userImg, cardImg} = product

  return `
    <div class="product">

      <img src="${cardImg}" alt="${name}">
      <div class="product-info-container">

          <div class="product-info-top">
            <h3>${name}</h3>
            <p>Current Bid</p>
          </div>

          <div class="product-info-mid">
            <div class="user-info">
              <img src="${userImg}" alt="Usuario">
              <p>@${user}</p>
            </div>
            <span>${bid} eTH</span>
          </div>

          <div class="product-info-bot">
            <div class="offer-time">
              <img src="assets/img/fire.png" alt="Fuego">
              <p>05:12:07</p>
            </div>
            <button class="btn-add">Add</button>
          </div>
        </div>
      </div>
    `
}

//Funcion para renderizar productos
const renderProducts = (productList) => {
  //console.log(productList);
  productsContainer.innerHTML += productList.map(createProductTemplate).join('')
}
/* ---------------------- Fin ----------------------------- */



/* ----------- Logica para ver mas productos ----------- */
// Funcion para saber si estamos al final del array
const isLastIndexOF = () =>{
  return appState.currentProductsIndex == appState.productsLimit-1
}

// Funcion para renderizar los productos cuando apretamos ver mas
const showMoreProducts = () => {
  appState.currentProductsIndex += 1;

  let {products, currentProductsIndex} = appState

  renderProducts(products[currentProductsIndex]);

  if (isLastIndexOF()){
    showMoreBtn.classList.add('hidden')
  } 
} 

// Funcion para ocultar el boton ver mas si hay una categoria seleccionada
const setShowMoreVisibility = () => {
  if(!appState.activeFilter){
    showMoreBtn.classList.remove('hidden')
  }
  showMoreBtn.classList.add('hidden')
}
/* --------------------- fin ------------------------------ */




/* ----------- Logica para los filtros ----------- */
// Funcion para saber si el elemento que apretamos es un btn de categoria y no esta activo
// retorna true si el elemento que apretamos es un btn  y no esta activo
const isInactiveFilterBtn = (element) => {
  return element.classList.contains('category') && !element.classList.contains('active')
}


// Funcion sacar la clase 'active' a uno y ponerselo a otro
const changeBtnActiveState = (selectedCategory) => {
  // traemos todos los botones y los guardamos en el array
  const categories = [...categotiesList];
  // lo recorremos con un for each. para cada boton de categoria revisamos el dataset, y si es distinto del que seleccionamos al hacer click, le quitamos la clase active
  categories.forEach((btn) => {
    if (btn.dataset.category !== selectedCategory) {
      btn.classList.remove('active');
      return;
    }
    // caso contrario, es decir, cuando se recorra el array y llegue al btn que tiene el dataset que guardamos en appstate al clickear, le vamos a poner la clase active
    btn.classList.add('active')
  })
}


// Funcion para cambiar el estado del filtro activo
const changeFilterState = (btn) => {
  appState.activeFilter = btn.dataset.category;
  changeBtnActiveState(appState.activeFilter);

  setShowMoreVisibility();
}


// Funcion para filtrar los productos seleccionados
const renderFilteredProducts = () => {
  const filteredProducts = productsData.filter((product) => product.category === appState.activeFilter);
  renderProducts(filteredProducts)
}


// Funcion para aplicar filtros
const applyFilter = ( { target } ) => {
  if (!isInactiveFilterBtn(target)) return // si se clickea el container o un btn activo no hagas nada
  // Caso contrario cambia el estado del appState
  changeFilterState(target);

  productsContainer.innerHTML = '';
  
  if (appState.activeFilter) {
    renderFilteredProducts()
    appState.currentProductsIndex = 0;
    return;
  }
  renderProducts(appState.products[0]);
}
/* --------------------- fin ------------------------------ */


//Funcion Inicializadora
const init = () => {
  renderProducts(appState.products[0]);
  showMoreBtn.addEventListener('click', showMoreProducts);
  categotiesConteiner.addEventListener('click', applyFilter)
}

init();

