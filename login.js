// Predefined users (in a real application, this would be stored securely on a server)
const users = {
    'wesley': {
        password: 'amor123',
        name: 'Wesley'
    },
    'julia': {
        password: 'amor42404',
        name: 'Julia'
    }
};

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;
    
    if (users[username] && users[username].password === password) {
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            name: users[username].name
        }));
        
        // Redirect to main page
        window.location.href = 'index.html';
    } else {
        alert('Nome ou senha incorretos. Tente novamente.');
    }
}); 