document.addEventListener("DOMContentLoaded", function () {
    // Debugging: Check if script is running
    console.log("script.js loaded!");

    // Get elements
    const loginBtn = document.querySelector(".btn-login");
    const registerBtn = document.querySelector(".btn-register");
    const profileMenu = document.querySelector(".profile-menu"); // Ensure this exists in your HTML
    const logoutBtn = document.querySelector(".btn-logout");

    // Check if user is logged in (Assuming token is stored in localStorage)
    const userToken = localStorage.getItem("authToken");

    // Debugging: Check if the token is stored
    console.log("User Token:", userToken);

    if (userToken) {
        console.log("User is logged in");

        // Hide login and register buttons
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";

        // Show profile menu (Ensure it exists in HTML)
        if (profileMenu) profileMenu.style.display = "block";
    } else {
        console.log("User is not logged in");
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            console.log("Logging out...");
            localStorage.removeItem("authToken"); // Remove token
            window.location.href = "index.html"; // Redirect to Home
        });
    }

    // Toggle Menu for Mobile
    const toggleMenu = document.querySelector(".toggle-menu");
    const navLinks = document.querySelector(".nav-links");

    if (toggleMenu && navLinks) {
        toggleMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }
});
