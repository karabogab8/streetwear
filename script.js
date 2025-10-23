// hamburger meny funksjonalitet - åpner og lukker sidebar
const hamburger = document.getElementById("hamburger")
const nav = document.getElementById("nav")
const navLinks = document.querySelectorAll(".nav-link")

// toggle funksjon - bytter mellom åpen og lukket
function toggleMenu() {
  hamburger.classList.toggle("active")
  nav.classList.toggle("active")
  document.body.classList.toggle("no-scroll") // låser scrolling når meny er åpen

  // oppdaterer aria for skjermlesere
  const isExpanded = hamburger.classList.contains("active")
  hamburger.setAttribute("aria-expanded", isExpanded)
}

hamburger.addEventListener("click", toggleMenu)

// lukker menyen når man klikker på en lenke
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (nav.classList.contains("active")) {
      toggleMenu()
    }
  })
})

// produktdata - her ligger alle produktene våre
// kunne vært hentet fra en database, men holder det enkelt
const products = [
  {
    id: 1,
    name: "Essential T-Shirt",
    category: "tshirt",
    price: 399,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 2,
    name: "Oversized Hoodie",
    category: "hoodie",
    price: 899,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  },
  {
    id: 3,
    name: "Classic Cap",
    category: "cap",
    price: 299,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
  },
  {
    id: 4,
    name: "Premium T-Shirt",
    category: "tshirt",
    price: 449,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
  },
  {
    id: 5,
    name: "Zip Hoodie",
    category: "hoodie",
    price: 949,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  },
  {
    id: 6,
    name: "Beanie",
    category: "accessories",
    price: 249,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
  },
  {
    id: 7,
    name: "Graphic T-Shirt",
    category: "tshirt",
    price: 429,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
  },
  {
    id: 8,
    name: "Pullover Hoodie",
    category: "hoodie",
    price: 879,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  },
  {
    id: 9,
    name: "Snapback Cap",
    category: "cap",
    price: 329,
    image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&q=80",
  },
  {
    id: 10,
    name: "Tote Bag",
    category: "accessories",
    price: 199,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
  },
  {
    id: 11,
    name: "Long Sleeve T-Shirt",
    category: "tshirt",
    price: 479,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  },
  {
    id: 12,
    name: "Bucket Hat",
    category: "cap",
    price: 279,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
  },
]

const productsGrid = document.getElementById("products-grid")
const filterButtons = document.querySelectorAll(".filter-btn")

// renderer produkter basert på valgt filter
// hvis filter er "all" viser vi alt, ellers filtrerer vi
function renderProducts(filter = "all") {
  productsGrid.innerHTML = "" // tømmer først

  // filtrerer produktene basert på kategori
  const filteredProducts = filter === "all" ? products : products.filter((p) => p.category === filter)

  // lager et card for hvert produkt
  filteredProducts.forEach((product, idx) => {
    const card = document.createElement("article")
    card.className = "product-card"
    card.style.animationDelay = `${idx * 0.1}s` // staggered animation

    // bygger HTML for kortet
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <p class="product-category">${getCategoryName(product.category)}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price} kr</p>
      </div>
      <div class="product-actions">
        <button class="add-to-cart" data-id="${product.id}">Legg til i kurv</button>
      </div>
    `

    productsGrid.appendChild(card)
  })

  // legger til event listeners på alle "legg til" knapper
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = Number.parseInt(e.target.dataset.id)
      addToCart(productId)
    })
  })
}

// oversetter kategori koder til norske navn
function getCategoryName(cat) {
  const names = {
    tshirt: "T-Shirt",
    hoodie: "Hoodie",
    cap: "Caps",
    accessories: "Tilbehør",
  }
  return names[cat] || cat
}

// filter knapper - bytter aktiv klasse og renderer på nytt
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // fjerner active fra alle
    filterButtons.forEach((b) => b.classList.remove("active"))
    // legger til active på den som ble klikket
    btn.classList.add("active")
    // renderer produkter med nytt filter
    renderProducts(btn.dataset.filter)
  })
})

// renderer alle produkter ved page load
renderProducts()

// handlekurv funksjonalitet
let cart = [] // array som holder alle items i kurven

// henter alle nødvendige elementer
const cartBtn = document.getElementById("cart-btn")
const cartSidebar = document.getElementById("cart-sidebar")
const cartClose = document.getElementById("cart-close")
const cartOverlay = document.getElementById("cart-overlay")
const cartItems = document.getElementById("cart-items")
const cartCount = document.getElementById("cart-count")
const cartTotal = document.getElementById("cart-total")

// åpner handlekurv sidebar
function openCart() {
  cartSidebar.classList.add("active")
  cartOverlay.classList.add("active")
  document.body.classList.add("no-scroll") // låser scrolling
  cartSidebar.setAttribute("aria-hidden", "false")
}

// lukker handlekurv sidebar
function closeCart() {
  cartSidebar.classList.remove("active")
  cartOverlay.classList.remove("active")
  document.body.classList.remove("no-scroll")
  cartSidebar.setAttribute("aria-hidden", "true")
}

// event listeners for å åpne/lukke kurv
cartBtn.addEventListener("click", openCart)
cartClose.addEventListener("click", closeCart)
cartOverlay.addEventListener("click", closeCart) // klikk utenfor lukker også

// legger produkt til i kurven
function addToCart(productId) {
  // finner produktet i products array
  const product = products.find((p) => p.id === productId)
  if (!product) return // hvis ikke funnet, avbryt

  // sjekker om produktet allerede er i kurven
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    // hvis det finnes, øk bare antallet
    existingItem.quantity += 1
  } else {
    // hvis nytt, legg til med quantity 1
    cart.push({ ...product, quantity: 1 })
  }

  updateCart() // oppdaterer UI
  openCart() // åpner kurven så brukeren ser hva som skjedde

  // visuell feedback på knappen
  const btn = document.querySelector(`[data-id="${productId}"]`)
  if (btn) {
    btn.textContent = "Lagt til!"
    btn.style.background = "var(--color-accent)"
    btn.style.color = "var(--color-black)"

    // tilbakestiller etter 1 sekund
    setTimeout(() => {
      btn.textContent = "Legg til i kurv"
      btn.style.background = ""
      btn.style.color = ""
    }, 1000)
  }
}

// oppdaterer hele handlekurv UI
function updateCart() {
  // regner ut totalt antall items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
  cartCount.style.display = totalItems > 0 ? "flex" : "none" // skjuler badge hvis tom

  // regner ut total pris
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = `${total} kr`

  // hvis kurven er tom, vis melding
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Handlekurven din er tom</p>'
    return
  }

  // bygger HTML for alle items i kurven
  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-price">${item.price} kr</p>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Reduser antall">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Øk antall">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Fjern fra kurv">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `,
    )
    .join("")
}

// oppdaterer antall av et produkt (+ eller -)
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change // legger til eller trekker fra

  // hvis antallet blir 0 eller mindre, fjern helt
  if (item.quantity <= 0) {
    removeFromCart(productId)
  } else {
    updateCart()
  }
}

// fjerner et produkt helt fra kurven
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCart()
}

// gjør funksjonene tilgjengelige globalt for onclick handlers
window.updateQuantity = updateQuantity
window.removeFromCart = removeFromCart

// quick add knapper på drop cards
document.querySelectorAll(".quick-add").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = Number.parseInt(e.target.dataset.product)
    addToCart(productId)
  })
})

// intro video funksjonalitet
const videoIntro = document.getElementById("video-intro")
const introVideo = document.getElementById("intro-video")
const skipBtn = document.getElementById("skip-intro")

// skjuler intro video
function hideIntro() {
  videoIntro.classList.remove("active")
  document.body.classList.remove("no-scroll")
}

// forskjellige måter å lukke intro på
skipBtn.addEventListener("click", hideIntro) // skip knapp
introVideo.addEventListener("ended", hideIntro) // når video er ferdig
setTimeout(hideIntro, 24000) // eller etter 24 sekunder

// header scroll oppførsel - skjuler header når man scroller ned
let lastScroll = 0
const header = document.getElementById("header")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  // hvis vi scroller ned og er forbi 100px, skjul header
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.style.transform = "translateY(-100%)"
  } else {
    // ellers vis header
    header.style.transform = "translateY(0)"
  }

  lastScroll = currentScroll
})

// kontaktskjema håndtering
const contactForm = document.getElementById("contact-form")

contactForm.addEventListener("submit", (e) => {
  e.preventDefault() // stopper normal form submit

  // henter form data
  const formData = new FormData(contactForm)
  const data = Object.fromEntries(formData)

  // her ville vi normalt sendt til en server
  console.log("Skjema sendt:", data)

  // viser bekreftelse til bruker
  alert("Takk for din melding! Vi kommer tilbake til deg snart.")
  contactForm.reset() // tømmer skjemaet
})

// nyhetsbrev påmelding
const newsletterForms = document.querySelectorAll(".newsletter-form")

newsletterForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // henter email fra input felt
    const email = form.querySelector('input[type="email"]').value

    // her ville vi normalt sendt til en server
    console.log("Nyhetsbrev påmelding:", email)

    alert("Takk for at du abonnerer på vårt nyhetsbrev!")
    form.reset()
  })
})

// scroll animasjoner med intersection observer
// dette gjør at elementer fader inn når de kommer i viewport
const observerOptions = {
  threshold: 0.1, // trigger når 10% er synlig
  rootMargin: "0px 0px -50px 0px", // litt før de kommer helt i view
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // når elementet kommer i view, vis det
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// observer alle relevante elementer
document.querySelectorAll(".drop-card, .product-card, .value-item").forEach((el) => {
  observer.observe(el)
})

// tastatur tilgjengelighet - escape key lukker ting
document.addEventListener("keydown", (e) => {
  // escape lukker handlekurv hvis den er åpen
  if (e.key === "Escape" && cartSidebar.classList.contains("active")) {
    closeCart()
  }

  // escape lukker også navigasjon hvis den er åpen
  if (e.key === "Escape" && nav.classList.contains("active")) {
    toggleMenu()
  }
})
