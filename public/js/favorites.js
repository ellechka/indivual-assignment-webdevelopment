// Gets the saved IDs of favorite restaurants
export function getFavoriteIds() {
    return JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]');
}

// Adds or removes a restaurant from the favorites list
export function toggleFavorite(id) {
    const favorites = getFavoriteIds();
    
    // Updates the list by removing the ID if present or adding it otherwise
    const updatedFavorites = favorites.includes(id)
        ? favorites.filter((favoriteId) => favoriteId !== id)
        : [...favorites, id];

    // Saves the updated favorites list in local storage
    localStorage.setItem('favoriteRestaurants', JSON.stringify(updatedFavorites));
}

// Sorts favorite restaurants before the others
export function sortFavorites(restaurants) {
    const favorites = getFavoriteIds();

    // Returns favorites first, followed by the remaining restaurants
    return [
        ...restaurants.filter((restaurant) => favorites.includes(restaurant._id)),
        ...restaurants.filter((restaurant) => !favorites.includes(restaurant._id)),
    ];
}