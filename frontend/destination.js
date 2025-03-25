// Fetch and Display Featured Destinations
const destinationsGrid = document.getElementById('destinationsGrid');

async function fetchDestinations() {
    try {
        const response = await fetch('http://localhost:5000/api/destination/1');
        const data = await response.json();
        displayDestinations(data);
    } catch (error) {
        console.error('Error fetching destinations:', error);
    }
}

function displayDestinations(destinations) {
    destinationsGrid.innerHTML = destinations
        .map(
            (destination) => `
                <div class="destination-card">
                    <img src="${destination.image}" alt="${destination.name}">
                    <h3>${destination.name}</h3>
                    <p>${destination.description}</p>
                    <button onclick="bookDestination(${destination.id})">Book Now</button>
                </div>
            `
        )
        .join('');
}

function bookDestination(id) {
    alert(`Booking destination with ID: ${id}`);
    // Add booking logic here
}

// Initialize
fetchDestinations();