export const saveSessionStorage = (name, data) => {
    sessionStorage.setItem(name, JSON.stringify(data));
};

export const getSessionStorage = (name) => {
    const item = sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
}

export const removeSessionStorage = (name) => {
    sessionStorage.removeItem(name);
}