const CHECK_USERNAME_API_URL = `https://media2.edu.metropolia.fi/restaurant/api/v1/users/available`;

export async function isUsernameAvailable(username) {
    const response = await fetch(`${CHECK_USERNAME_API_URL}/${encodeURIComponent(username)}`);

    if (!response.ok) {
        throw new Error(`Username check failed: ${response.status}`);
    }

    const result = await response.json();

    return result.available;
}