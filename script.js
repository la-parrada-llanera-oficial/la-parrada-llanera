// AQUÍ VAN TUS PLATOS REALES. 
// Reemplaza toda la sección de 'const menuDishes' en tu script.js con este código:

const menuDishes = [
    {
        id: 1,
        name: "Parrilla Especial Llanera",
        category: "parrillas",
        price: 12.00,
        desc: "Carne a la llanera, arroz, papas fritas y ensalada fresca.",
        image: "parilla.jpeg"
    },
    {
        id: 2,
        name: "Cachapa con Queso de Mano",
        category: "cachapas",
        price: 13.00,
        desc: "Cachapa de maíz tierno con abundante queso de mano fresco.",
        image: "cachapa.jpeg"
    },
    {
        id: 3,
        name: "Pollo en Brasas",
        category: "parrillas",
        price: 15.00,
        desc: "Pollo asado al estilo tradicional con papas y vegetales.",
        image: "comida.jpeg"
    },
    {
        id: 4,
        name: "Parrilla Mixta Familiar",
        category: "parrillas",
        price: 24.00,
        desc: "Combinado especial de carnes a la parrilla con vegetales.",
        image: "comida2.jpeg"
    },
    {
        id: 5,
        name: "Sopa del Día + Bebida",
        category: "bebidas",
        price: 6.50,
        desc: "Sopa nutritiva acompañada de tu bebida refrescante.",
        image: "jugo.jpeg"
    }
];

let cart = [];
let currentCategory = 'todos';

// Ejecutar cuando el HTML cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    renderDishes(menuDishes);
    
    // Escuchar el buscador
    document.getElementById('searchInput').addEventListener('keyup', filterDishes);
    
    // Configurar filtros de pestañas
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category');
            applyFilters();
        });
    });

    // Escuchar botón final de WhatsApp
    document.getElementById('btnWhatsapp').addEventListener('click', sendWhatsAppOrder);
});

// Renderizar la cuadrícula de platos
function renderDishes(dishes) {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = '';

    if (dishes.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280;">No se encontraron platos.</p>';
        return;
    }

    dishes.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.innerHTML = `
            <div class="dish-img-container">
                <img src="${dish.image}" alt="${dish.name}" class="dish-img" onerror="this.src='https://placehold.co/600x400?text=Falta+Foto'">
            </div>
            <div class="dish-content">
                <h4 class="dish-title">${dish.name}</h4>
                <p class="dish-desc">${dish.desc}</p>
                <div class="dish-footer">
                    <span class="dish-price">$${dish.price.toFixed(2)}</span>
                    <button class="add-cart-btn" onclick="addToCart(${dish.id})">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterDishes() {
    applyFilters();
}

function applyFilters() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    let filtered = menuDishes;

    if (currentCategory !== 'todos') {
        filtered = filtered.filter(d => d.category === currentCategory);
    }

    filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchText) || 
        d.desc.toLowerCase().includes(searchText)
    );

    renderDishes(filtered);
}

// Funciones globales vinculadas a los botones del HTML
window.addToCart = function(dishId) {
    const dish = menuDishes.find(d => d.id === dishId);
    const itemInCart = cart.find(item => item.id === dishId);

    if (itemInCart) {
        itemInCart.qty += 1;
    } else {
        cart.push({ ...dish, qty: 1 });
    }
    updateCartUI();
};

window.updateCartQty = function(dishId, change) {
    const item = cart.find(i => i.id === dishId);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== dishId);
    }
    updateCartUI();
};

window.toggleCart = function() {
    document.getElementById('cartModal').classList.toggle('open');
};

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').innerText = totalCount;

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('cartTotal').innerText = `$${totalAmount.toFixed(2)}`;

    const cartItemsContainer = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px 0; color: #6b7280;">Tu pedido está vacío.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <div style="color: #d9531e; font-size: 0.85rem;">$${(item.price * item.qty).toFixed(2)}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('Por favor, agrega al menos un plato a tu pedido.');
        return;
    }

    const name = document.getElementById('customerName').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    if (!name || !address) {
        alert('Por favor escribe tu Nombre y Dirección.');
        return;
    }

    let message = `*¡NUEVO PEDIDO - LA PARADA LLANERA!* 🍽️\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Dirección:* ${address}\n\n`;
    message += `*DETALLE:*\n`;

    cart.forEach(item => {
        message += `• ${item.qty}x ${item.name} ($${(item.price * item.qty).toFixed(2)})\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    message += `\n*TOTAL:* $${total.toFixed(2)}\n`;
    message += `*DELIVERY:* Gratis 🛵`;

    window.open(`https://wa.me/584120883791?text=${encodeURIComponent(message)}`, '_blank');
}
