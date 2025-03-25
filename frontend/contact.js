// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
    }

    // Simulate form submission (replace with actual API call)
    console.log('Form Submitted:', { name, email, message });
    alert('Thank you for contacting us! We will get back to you soon.');
    document.getElementById('contactForm').reset();
});