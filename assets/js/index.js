// Contenedor de productos
const productsContainer = document.querySelector('.products-container');
// Boton ver mas
const showMoreBtn = document.querySelector('.btn-load');

// Contenedor de Categorias
const categotiesContainer = document.querySelector('.categories');
// Botones de Categoria
const categotiesList = document.querySelectorAll('.category');



// Boton carrito
const cartBtn = document.querySelector('.cart-label')
// Boton menu
const menuBtn = document.querySelector('.menu-label')
// div carrito
const cartMenu = document.querySelector('.cart')
// div menu(hamburguesa)
const barsMenu = document.querySelector('.navbar-list')
// overlay
const overlay = document.querySelector('.overlay')



// Cart bubble
const cartBubble = document.querySelector('.cart-bubble') 
// Total del carrito
const total = document.querySelector('.total')
// boton de comprar en el carro
const buyBtn = document.querySelector('.btn-buy');
// boton de borrar en el carro
const deleteBtn = document.querySelector('.btn-delete')
// contenedor del carrito
const cartContainer = document.querySelector('.cart-container')
// modal de success
const successModal = document.querySelector('.add-modal')

// array para guardar los productos que van a ir al carrito
let cart = JSON.parse(localStorage.getItem('cart')) || []

//Funcion para guardar en el LS
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

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
            <button 
              class="btn-add" 
              data-id='${id}' 
              data-name='${name}'
              data-bid='${bid}'
              data-img='${cardImg}'
            >Add</button>
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
  showMoreBtn.classList.remove('hidden')
}
/* --------------------- FIN ------------------------------ */



/* ----------- Logica Menu/Carrito modal ----------- */
/*Funcion para abrir el carrito */
const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");

  if (barsMenu.classList.contains("open-menu")) {
    barsMenu.classList.remove("open-menu");
    return;
  }

  overlay.classList.toggle("show-overlay");
}

/*Funcion para abrir el menu */
const toggleMenu = () => {
  barsMenu.classList.toggle("open-menu");

  if (cartMenu.classList.contains("open-cart")) {
    cartMenu.classList.remove("open-cart");
    return;
  }

  overlay.classList.toggle("show-overlay");
}

/*Funcion para cerrar el menu/carrito cuando se clickea el overlay */
const closeOnOverlayClick = () => {
  cartMenu.classList.remove("open-cart");
  barsMenu.classList.remove("open-menu");
  overlay.classList.remove("show-overlay");
}


/* --------------------- FIN ------------------------------ */




/* ------------------ Logica Carrito ----------------- */
// Funcion para crear el template del producto en el carrito
const createCartProductTemplate = (cartProduct) => {
  const {id, bid, img, name, quantity} = cartProduct

  return `
  <div class="cart-item">
    <img src="${img}" alt="${name}" />
  
    <div class="item-info">
      <h3 class="item-title">${name}</h3>
      <p class="item-bid">Current bid</p>
      <span class="item-price">${bid} ETH</span>
    </div>

    <div class="item-handler">
      <span class="quantity-handler down" data-id=${id}>-</span>
      <span class="item-quantity">${quantity}</span>
      <span class="quantity-handler up" data-id=${id}>+</span>
    </div>
  </div>
  `
} 

// Render Carrito
const renderCart = () => {
  if (!cart.length) {
    cartContainer.innerHTML = `<p class="empty-msg"> Agrega un producto </p>`
    return;
  }

  cartContainer.innerHTML = cart.map(createCartProductTemplate).join('')
}


// Funcion para calcular el total de la compra
const getCartTotal = () => {
  return cart.reduce((acc, cur) => acc + (Number(cur.bid) * cur.quantity), 0)
}

// Funcion para mostrar el total
const showCartTotal = () => {
  total.textContent = `${getCartTotal().toFixed(2)} ETH`
}

// Funcion para actualizar la burbuja con la cantidad de productos en el cart
const renderCartBubble = () => {
  cartBubble.textContent = cart.reduce((acc, cur) => acc + cur.quantity ,0)
}

// Funcion para habilitar/desahbilitar botones
const disableBtn = (btn) => {
  if(!cart.length) {
    btn.classList.add('disabled')
  } else{
    btn.classList.remove('disabled')
  }
}

// Funcion para ejecutar funciones necesarias para el estado del cart
const updateCartState = () => {
  saveCart()
  renderCart();
  showCartTotal();
  renderCartBubble();
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
}

// funcion a ejecutar al hacer click en el boton add
const addProduct = (e) => {
  if (!e.target.classList.contains('btn-add')) return; // no se hace nada si no clickeo el boton

  const product = e.target.dataset;

  // if para verificar que el producto a agregar no este en el carrito
  if (isExistingCartProduct(product)) { // si el producto existe en el carrito haz esto
    addUnitToProduct(product)
    showSuccessModal('Se agrego una unidad adicional de este producto')

  } else{ // si no existe en el carrito
    createCartProduct(product) // agregalo
    showSuccessModal('Producto añadido')
  } 

  updateCartState()
}


//Funcion para agregar una unidad del producto
const addUnitToProduct = (product) => {
  cart = cart.map((cartProduct) =>  // recorre el array de productos(objetos)
    cartProduct.id === product.id // si un producto del array(carrito) tiene el mismo id que el que clicke,
      ? {...cartProduct, quantity: cartProduct.quantity + 1 } // entonces a la propiedad quantity sumale 1
      : cartProduct //  sino dejalo asi no mas
  )
}

// funcion para saber si un producto ya existe en el carrito
const isExistingCartProduct = (product) => {
  return cart.find((item) => item.id === product.id) // devuelve el producto del array de productos del carrito que tiene el mismo id que el que clicke 
}

// funcion para crear un objeto con la info del product que queremos agregar al carrito
const createCartProduct = (product) => {
  cart = [...cart, { ...product, quantity:1 }]
}

// Funcion para mostrar modal de 'añadido al carro'
const showSuccessModal = (msg) => {
  successModal.classList.add('active-modal')
  successModal.textContent = msg

  setTimeout(() => {
    successModal.classList.remove('active-modal')
  } ,1500)
}

// Funcion logica del boton +
const handlePlusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id)
  addUnitToProduct(existingCartProduct)
}

// Funcion logica del boton -
const handleMinusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id)

  if (existingCartProduct.quantity === 1) {

    if (window.confirm('Deseas eliminar el producto?')) {
      removeProductFromCart(existingCartProduct)
    }

    return
  }
  
  substracProductUnit(existingCartProduct)
}

// Funcion para disminuir 1 unidad del carrito
const substracProductUnit = (existingCartProduct) => {
  cart = cart.map((cartProduct) =>  // recorre el array de productos(objetos)
    cartProduct.id === existingCartProduct.id // si un producto del array(carrito) tiene el mismo id que el que clicke,
      ? {...cartProduct, quantity: cartProduct.quantity - 1 } // entonces a la propiedad quantity restale 1
      : cartProduct //  sino dejalo asi no mas
  )
}

// Funcion para elimicar productos del carro
const removeProductFromCart = (existingCartProduct) => {
  cart = cart.filter((product) => product.id !== existingCartProduct.id)
  updateCartState()
}

// Funcion para manejar la cantidad de productos desde el carro - btn +/-
const handleQuantity = (e) => {
  if(e.target.classList.contains('up')){
    handlePlusBtnEvent(e.target.dataset.id);
  } else if (e.target.classList.contains('down')) {
    handleMinusBtnEvent(e.target.dataset.id)
  }

  // para cualquier caso
  updateCartState()
}


//Funcion para resetear carro
const resetCartItems = () => {
  cart = [];
  updateCartState();
}

// Funcion Boton comprar carro
const completeBuy = () => {
  completeCartAction('¿Deseas completar tu compra?', 'Gracias por tu compra')
}

// Funcion Boton vaciar carro
const deleteCart = () => {
  completeCartAction('¿Estas seguro de que quieres vaciar el carrito?', 'Carrito Vaciado')
}

// Funcion a ejecutar por los botones comprar y borrar todo del carro
const completeCartAction = (confirmMsg, successMsg) => {
  if(!cart.length) return
  if (window.confirm(confirmMsg)) {
    resetCartItems()
    alert(successMsg)
  }
}
/* --------------------- FIN ------------------------------ */



//Funcion Inicializadora
const init = () => {
  renderProducts(appState.products[0]);
  showMoreBtn.addEventListener('click', showMoreProducts);
  categotiesContainer.addEventListener('click', applyFilter);

  cartBtn.addEventListener('click', toggleCart);
  menuBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeOnOverlayClick);


  productsContainer.addEventListener('click', addProduct);
  document.addEventListener('DOMContentLoaded', renderCart);
  
  cartContainer.addEventListener('click', handleQuantity);
  
  disableBtn(buyBtn)
  disableBtn(deleteBtn)
  
  buyBtn.addEventListener('click' , completeBuy);
  deleteBtn.addEventListener('click', deleteCart);
  renderCartBubble();
}

init();