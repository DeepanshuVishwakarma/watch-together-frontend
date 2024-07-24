export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getTokenByEmail(email) {
  const storageKey = "users";
  let users = getLocalStorage(storageKey);
  const token = users[email];
  if (!token) {
    throw new Error("No token found for this email", email);
  }
}

export function setTokensInLocalStorage(token, user) {
  if (!user || !user.email) {
    console.error("Invalid user or user email");
    return;
  }

  const email = user.email;
  const storageKey = "users";

  let users = getLocalStorage(storageKey);

  if (!users) {
    users = {};
  }

  // Set the token for the given user's email
  users[email] = token;

  // Update local storage with the new users object
  setLocalStorage(storageKey, users);
}
