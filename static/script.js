document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const usersList = document.getElementById('usersList');
    const refreshBtn = document.getElementById('refreshBtn');
    const formError = document.getElementById('formError');
    const loading = document.getElementById('loading');

    // Загрузка пользователей при загрузке страницы
    loadUsers();

    // Обновление по кнопке
    refreshBtn.addEventListener('click', loadUsers);

    // Отправка формы
    userForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        try {
            loading.style.display = 'block';
            formError.textContent = '';
            
            const response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail);
            }

            // Очистка формы и обновление списка
            userForm.reset();
            loadUsers();
        } catch (error) {
            formError.textContent = error.message;
        } finally {
            loading.style.display = 'none';
        }
    });

    // Функция загрузки пользователей
    async function loadUsers() {
        try {
            loading.style.display = 'block';
            usersList.innerHTML = '<p>Загрузка данных...</p>';
            
            const response = await fetch('/users');
            if (!response.ok) throw new Error('Ошибка загрузки');
            
            const users = await response.json();
            
            if (users.length === 0) {
                usersList.innerHTML = '<p>Пользователи не найдены</p>';
                return;
            }
            
            usersList.innerHTML = '';
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.className = 'user-item';
                userElement.innerHTML = `
                    <span><strong>${user.name}</strong> (${user.email})</span>
                `;
                usersList.appendChild(userElement);
            });
        } catch (error) {
            usersList.innerHTML = `<p class="error">${error.message}</p>`;
        } finally {
            loading.style.display = 'none';
        }
    }
});