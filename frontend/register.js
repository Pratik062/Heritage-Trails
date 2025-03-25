// Function to toggle password visibility
function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleButton = passwordField.nextElementSibling; // The 👁️ button

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleButton.textContent = "🙈"; // Change icon to "hide"
    } else {
        passwordField.type = "password";
        toggleButton.textContent = "👁️"; // Change icon to "show"
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Function to validate password strength
function isValidPassword(password) {
    return password.length >= 6; // Enforce minimum password length
}

// Handle Registration Form Submission
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic Frontend Validation
    if (!username || !email || !password || !confirmPassword) {
        alert("All fields are required.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!isValidPassword(password)) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch("https://heritage-trails.onrender.com/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Success message
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert(data.message); // Show error message from backend
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("Server error. Please try again later.");
    }
});
