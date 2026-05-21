const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

const output = document.getElementById('output');
let activeTable = 'doors'; 

function checkAuth() {
    const token = localStorage.getItem('token');
    const authLink = document.getElementById('authLink');
    const navAdmin = document.getElementById('navAdmin');

    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (authLink) {
            authLink.textContent = 'Выход';
            authLink.href = '#';
            authLink.onclick = logout;
        }

        try {
            const decoded = jwt_decode(token); 
            if (navAdmin) {
                navAdmin.style.display = (decoded.role === 'ADMIN') ? 'inline-block' : 'none';
            }
        } catch (e) {
            console.error("Ошибка декодирования токена", e);
            if (navAdmin) navAdmin.style.display = 'none';
        }
    } else {
        if (navAdmin) navAdmin.style.display = 'none';
        if (authLink) {
            authLink.textContent = 'Вход/Регистрация';
            authLink.href = 'login.html';
            authLink.onclick = null;
        }
    }
}

async function login() {
    const loginValue = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    try {
        const response = await apiClient.post('/auth/login', { login: loginValue, password });
        localStorage.setItem('token', response.data.token); 
        alert('Успешный вход!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Ошибка входа: ' + (error.response?.data?.message || 'Неверные данные'));
    }
}

async function register() {
    const loginValue = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    let role = (password === '123') ? 'ADMIN' : 'USER';
    try {
        await apiClient.post('/auth/register', { login: loginValue, password, role });
        alert(`Registration successful! Role: ${role}`);
    } catch (error) {
        alert(error.response?.data?.message || "Ошибка регистрации");
    }
}

function logout() {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    alert('Вы вышли из системы');
    window.location.href = 'index.html';
}

const initialToken = localStorage.getItem('token');
if (initialToken) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}


async function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    try {
        const res = await apiClient.get('/doors');
        console.log("Данные получены:", res.data.data);
        const doorsArray = Array.isArray(res.data) ? res.data : (res.data?.doors || res.data?.rows || Object.values(res.data).find(Array.isArray) || []);
        console.log(doorsArray);
        if (doorsArray.length === 0) {
            grid.innerHTML = '<p style="text-align:center;">В базе данных пока нет товаров.</p>';
            return;
        }
        grid.innerHTML = doorsArray.map(door => `
            <div class="card">
                <h3>${door.doorName || 'Без названия'}</h3>
                <p>Цена: ${door.basePrice || 0} ₽</p> 
                <button class="btn-blue" onclick="addToCart(${door.id}, '${door.doorName}', ${door.basePrice})">
                    В корзину
                </button>
            </div>
        `).join('');
    } catch (e) {
        console.error("Ошибка отрисовки:", e);
        grid.innerHTML = `<p>Ошибка загрузки: ${e.response?.status === 401 ? 'Нужна авторизация' : 'Сервер не отвечает'}</p>`;
    }
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id, 
            name, 
            price: Number(price) || 0, 
            quantity: 1 
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Товар "${name}" добавлен в корзину!`);
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста</p>';
        return;
    }
    const totalOrderPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let html = cart.map((item, index) => `
        <div class="card">
            <h3>${item.name}</h3>
            <p>Цена: ${item.price} ₽ | Кол-во: ${item.quantity} шт.</p>
            <p>Сумма: <strong>${item.price * item.quantity} ₽</strong></p>
            <button onclick="removeFromCart(${index})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Удалить</button>
        </div>
    `).join('');
    html += `
        <div style="margin-top: 20px; padding: 15px; border-top: 2px solid #eee; text-align: right;">
            <h3>Итого к оплате: <span style="color: #2c3e50;">${totalOrderPrice} ₽</span></h3>
        </div>
    `;
    container.innerHTML = html;
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

async function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) return alert("Корзина пуста!");
    const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    try {
        const response = await apiClient.post('/orders', {
            quantity: totalQty,
            totalPrice: totalSum,
            status: 'Новый'
        });
        if (response.data.success) {
            alert(`Заказ на сумму ${totalSum} ₽ успешно оформлен!`);
            localStorage.removeItem('cart');
            window.location.href = 'orders.html';
        }
    } catch (error) {
        alert("Ошибка: " + (error.response?.data?.message || "Сервер недоступен"));
    }
}

async function renderOrders() {
    const list = document.getElementById('orders-list');
    if (!list) return;
    try {
        const res = await apiClient.get('/orders');
        const orders = res.data.data || [];
        if (orders.length === 0) {
            list.innerHTML = '<p>У вас пока нет заказов.</p>';
            return;
        }

        list.innerHTML = orders.map(order => `
            <div class="card">
                <h3>Заказ №${order.id}</h3>
                <p>Статус: <strong>${order.status || 'Новый'}</strong></p>
                <p>Сумма заказа: <span style="font-weight: bold; color: #27ae60;">${order.totalPrice} ₽</span></p>
                <p>Товаров: ${order.quantity} шт.</p>
                <button class="btn-red" onclick="deleteOrderRequest(${order.id})">Отменить заказ</button>
            </div>
        `).join('');
    } catch (e) {
        console.error("Ошибка отрисовки заказов:", e);
        list.innerHTML = `<p style="color:red;">Не удалось загрузить историю.</p>`;
    }
}

async function deleteOrderRequest(orderId) {
    if (!confirm("Вы действительно хотите отменить этот заказ?")) return;
    try {
        const res = await apiClient.delete(`/orders/${orderId}`);
        if (res.data.success) {
            alert("Заказ успешно отменен");
            renderOrders();
        }
    } catch (e) {
        console.error("Ошибка удаления:", e);
        alert("Не удалось отменить заказ: " + (e.response?.data?.message || "Ошибка доступа"));
    }
}



function switchTable(targetTable, element) {
    activeTable = targetTable;
    
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');
    
    const title = document.getElementById('currentTableTitle');
    const nameInput = document.getElementById('itemName');
    const extraInput = document.getElementById('basePrice');
    
    document.getElementById('itemId').value = '';
    if (nameInput) nameInput.value = '';
    if (extraInput) extraInput.value = '';

    if (targetTable === 'doors') {
        title.textContent = 'Управление таблицей: Двери (Door)';
        nameInput.placeholder = 'Название двери (doorName)';
        extraInput.placeholder = 'Цена базовой модели (basePrice)';
    } else if (targetTable === 'variants') { 
        title.textContent = 'Управление таблицей: Варианты дверей (DoorVariant)';
        nameInput.placeholder = 'Цвет модификации (color)';
        extraInput.placeholder = 'ID двери';
    } else if (targetTable === 'orders') {
        title.textContent = 'Управление таблицей: Заказы (Order)';
        nameInput.placeholder = 'Статус заказа (status)';
        extraInput.placeholder = 'Итоговая стоимость (totalPrice)';
    } else if (targetTable === 'storage') { 
        title.textContent = 'Управление таблицей: Склады (Storage)';
        nameInput.placeholder = 'Наименование склада (name)';
        extraInput.placeholder = 'ID двери'
    } else if (targetTable === 'stores') {
        title.textContent = 'Управление таблицей: Магазины (Store)';
        nameInput.placeholder = 'Название филиала (name)';
        extraInput.style='display:none';
    }

    displayAllDoors();
}

async function displayAllDoors() {
    if (!output) return;
    try {
        const response = await apiClient.get(`/${activeTable}`);
        const resultData = response.data.data !== undefined ? response.data.data : response.data;
        output.textContent = JSON.stringify(resultData, null, 2);
    } catch (error) {
        output.textContent = 'Ошибка загрузки данных из БД: ' + (error.response?.data?.error || error.message);
    }
}

async function getOneDoor() {
    const id = document.getElementById('itemId').value;
    if (!id) return alert("Введите ID записи для поиска!");
    if (!output) return;

    try {
        const response = await apiClient.get(`/${activeTable}/${id}`);
        const resultData = response.data.data !== undefined ? response.data.data : response.data;
        output.textContent = `[Данные по ID ${id} в таблице ${activeTable}]:\n` + JSON.stringify(resultData, null, 2);
    } catch (error) {
        if (error.response?.status === 404) {
            output.textContent = `Запись с ID ${id} в таблице "${activeTable}" отсутствует в БД.`;
        } else {
            output.textContent = 'Ошибка получения записи: ' + (error.response?.data?.error || error.message);
        }
    }
}

async function createDoor() {
    const name = document.getElementById('itemName').value;
    const extra = document.getElementById('basePrice').value;

    if (!name) return alert("Заполните основное поле ввода!");

    let payload = {};
    
    if (activeTable === 'doors') {
        payload = { doorName: name, basePrice: Number(extra) || 0 };
    } else if (activeTable === 'variants') {
        payload = { 
            doorId: Number(extra) || 1 , 
            size: "200x80", 
            color: name, 
            openingSide: "Универсальная", 
            extraCharge: 1000 
        };
    } else if (activeTable === 'orders') {
        payload = { status: name || 'Новый', totalPrice: Number(extra) || 0, quantity: 1 };
    } else if (activeTable === 'storage' || activeTable === 'stores') {
        payload = { name: name, productId: Number(extra) || 1 };
    }

    try {
        const response = await apiClient.post(`/${activeTable}`, payload);
        alert('Запись добавлена успешно!');
        displayAllDoors();
    } catch (error) {
        alert('Ошибка добавления: ' + (error.response?.data?.error || error.message));
    }
}

async function updateDoor() {
    const id = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value;
    const extra = document.getElementById('basePrice').value;

    if (!id) return alert("Введите ID записи для изменения!");

    let payload = {};
    if (activeTable === 'doors') {
        payload = { doorName: name, basePrice: Number(extra) || 0 };
    } else if (activeTable === 'variants') {
        payload = { color: name, doorId: Number(extra) || 0 };
    } else if (activeTable === 'orders') {
        payload = { status: name, totalPrice: Number(extra) || 0 };
    } else if (activeTable === 'storage' || activeTable === 'stores') {
        payload = { name: name, productId: Number(extra) };
    }

    try {
        await apiClient.put(`/${activeTable}/${id}`, payload);
        alert(`Запись с ID ${id} обновлена!`);
        displayAllDoors();
    } catch (error) {
        alert('Ошибка изменения: ' + (error.response?.data?.error || error.message));
    }
}

async function deleteDoor() {
    const id = document.getElementById('itemId').value;
    if (!id) return alert("Введите ID записи для удаления!");
    if (!confirm(`Удалить запись с ID ${id} из текущей таблицы?`)) return;

    try {
        await apiClient.delete(`/${activeTable}/${id}`);
        alert(`Запись с ID ${id} успешно удалена`);
        document.getElementById('itemId').value = '';
        displayAllDoors();
    } catch (error) {
        alert('Ошибка удаления: ' + (error.response?.status === 403 ? 'Нужны права ADMIN' : error.message));
    }
}