const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

const output = document.getElementById('output');

window.onload = () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        const statusElem = document.getElementById('authStatus');
        const logoutBtn = document.getElementById('logoutBtn');
        // const post = document.getElementById('post');
        // const put = document.getElementById('put');
        // const del = document.getElementById('delete');
        if (statusElem) {
            statusElem.textContent = 'Статус: Авторизован';
            statusElem.style.color = 'green';
        }
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    }
};

async function register() {
    const loginValue = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    let role = (password === '123') ? 'ADMIN' : 'USER';

    try {
        await apiClient.post('/auth/register', { login: loginValue, password, role });
        alert(`Регистрация успешна! Роль: ${role}`);
    } catch (error) {
        alert(error.response?.data?.message || "Ошибка регистрации");
    }
}

async function login() {
    const loginValue = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    try {
        const response = await apiClient.post('/auth/login', { login: loginValue, password });
        const token = response.data.token;
        
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        document.getElementById('authStatus').textContent = 'Статус: Авторизован';
        document.getElementById('authStatus').style.color = 'green';
        document.getElementById('logoutBtn').style.display = 'inline-block';
    } catch (error) {
        alert('Ошибка входа: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
    }
}

function logout() {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    alert('Вы вышли из системы');
    location.reload();
}

async function displayAllDoors() {
    try {
        const response = await apiClient.get('/doors');
        output.textContent = JSON.stringify(response.data, null, 2);
        output.style.color = 'black';
    } catch (error) {
        if (error.response?.status === 401) {
            output.textContent = 'Ошибка: Пожалуйста, войдите в систему, чтобы увидеть данные.';
            output.style.color = 'red';
        } else {
            output.textContent = 'Ошибка: ' + error.message;
        }
    }
}

async function createDoor() {
    const name = document.getElementById('itemName').value;
    try {
        const response = await apiClient.post('/doors', { doorName: name });
        output.textContent = 'Создано: ' + JSON.stringify(response.data, null, 2);
        displayAllDoors();
    } catch (error) {
        output.textContent = 'Ошибка создания: ' + (error.response?.status === 403 ? 'Нужен ADMIN' : 'Ошибка');
    }
}

async function updateDoor() {
    const name = document.getElementById('itemName').value;
    const id = document.getElementById('itemId').value;
    try {
        const response = await apiClient.put(`/doors/${id}`, { doorName: name });
        output.textContent = 'Обновлено: ' + JSON.stringify(response.data, null, 2);
        displayAllDoors();
    } catch (error) {
        output.textContent = 'Ошибка создания: ' + (error.response?.status === 403 ? 'Нужен ADMIN' : 'Ошибка');
    }
}

async function deleteDoor() {
    const id = document.getElementById('itemId').value;
    try {
        await apiClient.delete(`/doors/${id}`);
        output.textContent = 'Удалено успешно';
        displayAllDoors();
    } catch (error) {
        if (error.response?.status === 403) {
            output.textContent = 'Ошибка: Нужен ADMIN';
        } else {
            output.textContent = 'Ошибка при удалении';
        }
    }
}