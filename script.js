var swiper = new Swiper(".mySwiper", {
  loop: true,

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const basketIcon = document.querySelector('.cart-icon');
const itemCard = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardItemList = document.querySelector('.card-list');
const itemList = document.querySelector('.item-list');
const cartTotal = document.querySelector('.total-price');
const mouseShadow1 = document.querySelector('.mouse-shadow1');
const mouseShadow2 = document.querySelector('.mouse-shadow2');
const mouseShadow3 = document.querySelector('.mouse-shadow3');
const reviewCotent = document.querySelector('.review-content');
const appContent = document.querySelector('.app-container');


document.addEventListener('mousemove', (e) => {
  mouseShadow1.style.left = `${e.clientX}px`;
  mouseShadow1.style.top = `${e.clientY}px`;
});

reviewCotent.addEventListener('mousemove', (e) => {
  const rect = reviewCotent.getBoundingClientRect();

  mouseShadow2.style.left = `${e.clientX - rect.left}px`;
  mouseShadow2.style.top = `${e.clientY - rect.top}px`;

  mouseShadow2.style.opacity = '1';
});

reviewCotent.addEventListener('mouseleave', () => {
  mouseShadow2.style.opacity = '0';
});

appContent.addEventListener('mousemove', (e) => {
  const rect = appContent.getBoundingClientRect();

  mouseShadow3.style.left = `${e.clientX - rect.left}px`;
  mouseShadow3.style.top = `${e.clientY - rect.top}px`;

  mouseShadow3.style.opacity = '1';
});

appContent.addEventListener('mouseleave', () => {
  mouseShadow3.style.opacity = '0';
});



function showItemCloseList() {
  basketIcon.addEventListener('click', (e) => {
    e.preventDefault();
    itemCard.classList.toggle('cart-tab-active');
  });
}

function closeItemList() {
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    itemCard.classList.remove('cart-tab-active');
  });
}


let productList = [];
let cartProducts = [];

function updateTotalPrice() {
  let totalPrice = 0;

  document.querySelectorAll('.items').forEach(item => {
    const price = parseFloat(item.querySelector('.price').textContent.replace("$", ''));
    totalPrice += price
  })
  
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

function showCards() {
  productList.forEach(product => {
    const orderItem = document.createElement('div');
    orderItem.classList.add('menu-card');
    
    orderItem.innerHTML = `
    <div class="img">
      <img src="${product.image}" alt="image" />
    </div>

    <h2>${product.name}</h2>
    <p>${product.price}</p>

    <div class="add-cart">
      <button class="add-btn">Add to Cart</button>
    </div>`;

    cardItemList.appendChild(orderItem);

    const addBtn = orderItem.querySelector('.add-btn');
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addToItem(product);
      addBtn.textContent = 'Added';
      addBtn.style.backgroundColor = 'rgb(44, 44, 44)';

      // button ka reference save kar lo
      product.button = addBtn;
    })

  })
}

// cartBox increase and decrease iteMValue
const cartValue = document.querySelector('.cart-value');
let currentValue = Number(cartValue.textContent);
// end

function addToItem(product) {

  const existingProduct = cartProducts.find(item => item.id === product.id);

  if(existingProduct) {
    alert('this item has been already added');
    return;
  }

  cartProducts.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace("$", ""));

  const cartItem = document.createElement('div');
  cartItem.classList.add('items');

  cartItem.innerHTML = `
     <div class="item-image">
      <img src="${product.image}" alt="" />
     </div>

      <div class="item-content">
       <h4>${product.name}</h4>
       <h4 class="price">${product.price}</h4>
      </div>
     <div class="quantity-item">
      <a href="#" class="quantity-btn minus">
        <i class="fa-solid fa-minus"></i>
      </a>
      
      <h3 class="quantity-value">${quantity}</h3>

      <a href="#" class="quantity-btn plus">
        <i class="fa-solid fa-plus"></i>
      </a>
     </div>
    `;

  itemList.appendChild(cartItem);
  updateTotalPrice();
  currentValue++;
  cartValue.textContent = currentValue;


  let plusBtn = cartItem.querySelector(".plus");
  let minusBtn = cartItem.querySelector(".minus");
  let quantityVal = cartItem.querySelector(".quantity-value");
  let totalPrice = cartItem.querySelector('.price');

  // function quantityItem() {
    plusBtn.addEventListener('click', (e) => {
      e.preventDefault(); // page reload hone se rokega
      quantity++;
      quantityVal.innerText = quantity;

      totalPrice.textContent = `$${(price * quantity).toFixed(2)}`
      updateTotalPrice();
    })

    minusBtn.addEventListener('click', (e) => {
      e.preventDefault(); // page reload hone se rokega
      if(quantity > 1) {
        quantity--;
        quantityVal.innerText = quantity;

        totalPrice.textContent = `$${(price * quantity).toFixed(2)}`
      }
      else {
        cartItem.classList.add('slide-out');
        
        setTimeout(() => {
          cartItem.remove();
          cartProducts = cartProducts.filter(item => item.id !== product.id);
          
          // cartBox
          currentValue--;
          cartValue.textContent = currentValue;

          // button ko reset karo
          product.button.textContent = 'Add to Cart';
          product.button.style.backgroundColor = '';

          updateTotalPrice();
        }, 300)
      }

      updateTotalPrice();
    })
}


function initApp() {
  fetch('products.json').then
  (response => response.json()).then
  (data => {
    productList = data;
    showCards();
  })
}


showItemCloseList();
closeItemList();
initApp();
