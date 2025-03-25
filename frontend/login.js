document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton'); // Add an ID to the login button
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Frontend validation
    if (!email || !password) {
        alert('All fields are required.');
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Invalid email format.');
        return;
    }

    // Password length validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    loginButton.disabled = true; // Disable button to prevent multiple clicks

    try {
        const response = await fetch('https://heritage-trails.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        alert(data.message);
        localStorage.setItem('authToken', data.token); // Store token securely
        window.location.href = 'index.html'; // Redirect to home page
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'Something went wrong, please try again.');
    } finally {
        loginButton.disabled = false; // Re-enable button
    }
});
