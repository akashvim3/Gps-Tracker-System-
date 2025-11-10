// ===========================
// MAP INITIALIZATION
// ===========================
function initMap() {
    // Default coordinates (San Francisco)
    const defaultCoords = [37.7749, -122.4194];

    // Initialize Leaflet map
    map = L.map('map').setView(defaultCoords, 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add demo markers
    addDemoMarkers();

    // Start real-time tracking simulation
    startRealTimeTracking();
}

// ===========================
// ADD DEMO MARKERS
// ===========================
function addDemoMarkers() {
    const devices = [
        {
            name: 'Tesla Model 3',
            coords: [37.7849, -122.4094],
            icon: '🚗',
            status: 'Moving',
            speed: 45
        },
        {
            name: 'Delivery Van #12',
            coords: [37.7649, -122.4294],
            icon: '🚚',
            status: 'Parked',
            speed: 0
        },
        {
            name: 'Yamaha R15',
            coords: [37.7949, -122.3994],
            icon: '🏍️',
            status: 'Moving',
            speed: 30
        }
    ];

    devices.forEach(device => {
        const marker = L.marker(device.coords).addTo(map);
        marker.bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <div style="font-size: 32px; margin-bottom: 8px;">${device.icon}</div>
                <strong>${device.name}</strong><br>
                <span style="color: #64748b;">Status: ${device.status}</span><br>
                <span style="color: #64748b;">Speed: ${device.speed} mph</span>
            </div>
        `);
        markers.push(marker);
    });
}

// ===========================
// REAL-TIME TRACKING SIMULATION
// ===========================
function startRealTimeTracking() {
    setInterval(() => {
        // Update coordinates display
        const lat = (37.7749 + (Math.random() - 0.5) * 0.01).toFixed(6);
        const lng = (-122.4194 + (Math.random() - 0.5) * 0.01).toFixed(6);
        const speed = Math.floor(Math.random() * 60) + 20;

        document.getElementById('lat').textContent = lat;
        document.getElementById('lng').textContent = lng;
        document.getElementById('speed').textContent = speed;

        // Update address (simulated)
        updateAddress(lat, lng);
    }, 3000);
}

// ===========================
// UPDATE ADDRESS
// ===========================
function updateAddress(lat, lng) {
    const addresses = [
        '1234 Main St, San Francisco, CA 94102',
        '5678 Market St, San Francisco, CA 94103',
        '9012 Mission St, San Francisco, CA 94110',
        '3456 Valencia St, San Francisco, CA 94110'
    ];

    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    document.getElementById('current-address').textContent = randomAddress;
}

// ===========================
// MAP CONTROLS
// ===========================
function centerMap() {
    if (map) {
        map.setView([37.7749, -122.4194], 13);
    }
}

function toggleSatellite() {
    alert('Satellite view toggled');
}

function toggleTraffic() {
    alert('Traffic layer toggled');
}

function fullscreenMap() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
    } else if (mapContainer.webkitRequestFullscreen) {
        mapContainer.webkitRequestFullscreen();
    } else if (mapContainer.msRequestFullscreen) {
        mapContainer.msRequestFullscreen();
    }
}

// ===========================
// INITIALIZE DASHBOARD
// ===========================
if (document.getElementById('map')) {
    document.addEventListener('DOMContentLoaded', () => {
        initMap();
    });
}
