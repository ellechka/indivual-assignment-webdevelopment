const CHECK_USERNAME_API_URL = `https://media2.edu.metropolia.fi/restaurant/api/v1/users/available`;

// Checks whether the given username is available for registration
export async function isUsernameAvailable(username) {

    // Requests username availability from the API
    const response = await fetch(`${CHECK_USERNAME_API_URL}/${encodeURIComponent(username)}`);

    // If API request has been failed, stops this function and throws Error
    if (!response.ok) {
        throw new Error(`Username check failed: ${response.status}`);
    }

    // Parses the API response as JSON
    const result = await response.json();

    //returns boolean username's availability
    return result.available;
}