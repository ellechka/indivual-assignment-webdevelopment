let map;
let marker;

// Shows the selected restaurant on the map.
export function showRestaurantMap(restaurant) {
    const [longitude, latitude] = restaurant.location.coordinates;
    const mapContainer = document.querySelector('#map');
    mapContainer.hidden = false;

    if (!map) {
        // Creates the map, adds the OpenStreetMap tiles, and marks the restaurant
        map = window.L.map(mapContainer).setView([latitude, longitude], 15);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        marker = window.L.marker([latitude, longitude]).addTo(map);
    } else {
        // Moves the map and marker to the selected restaurant.
        map.setView([latitude, longitude], 15);
        marker.setLatLng([latitude, longitude]);
    }

    // Shows the restaurant name and refreshes the map size.
    marker.bindPopup(restaurant.name).openPopup();
    map.invalidateSize();
}
