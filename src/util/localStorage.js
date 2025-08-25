export const keysLocalStorage = {
    INFO_USER: "INFO_USER",
    LIST_USER: "LIST_USER", // Thêm key cho danh sách user
}

export const localStorageUtil = {
    set: (key, value) => {
        let valueString = JSON.stringify(value);
        localStorage.setItem(key, valueString);
    },
    get: (key) => {
        let valueString = localStorage.getItem(key);
        return valueString ? JSON.parse(valueString) : null;
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    // Thêm hàm lưu danh sách user
    setListUser: (listUser) => {
        localStorage.setItem(keysLocalStorage.LIST_USER, JSON.stringify(listUser));
    },
    getListUser: () => {
        const valueString = localStorage.getItem(keysLocalStorage.LIST_USER);
        return valueString ? JSON.parse(valueString) : [];
    },
    removeListUser: () => {
        localStorage.removeItem(keysLocalStorage.LIST_USER);
    }
}