const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

const output = document.getElementById('output');

async function register() {
    const login = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    
    try {
        const response = await apiClient.post('/auth/register', { login, password });
        alert('Регистрация успешна!');
        console.log(response.data);
    } catch (error) {
        alert('Ошибка регистрации: ' + error.response.data.message);
    }
}

async function login() {
    const login = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        const token = response.data.token;
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        alert('Вы вошли в систему!');
        document.getElementById('authStatus').textContent = 'Статус: Авторизован';
    } catch (error) {
        alert('Ошибка входа: ' + error.response.data.message);
    }
}

async function fetchAllDoors() {
    try {
        const response = await apiClient.get('/doors');
        output.textContent = JSON.stringify(response.data, null, 2);
    } catch (error) {
        output.textContent = 'Ошибка: ' + error.message;
    }
}
async function createDoor() {
    const name = document.getElementById('itemName').value;
    try {
        const response = await apiClient.post('/doors', { name: name });
        output.textContent = 'Создано: ' + JSON.stringify(response.data, null, 2);
    } catch (error) {
        output.textContent = 'Ошибка при создании';
    }
}
async function deleteDoor() {
    const id = document.getElementById('itemId').value;
    try {
        const response = await apiClient.delete(`/doors/${id}`);
        output.textContent = 'Удалено успешно';
    } catch (error) {
        output.textContent = 'Ошибка при удалении';
    }
}