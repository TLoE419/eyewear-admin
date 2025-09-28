import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    // 簡單的認證邏輯，實際應用中應該連接到真實的認證服務
    if (username === "admin" && password === "admin") {
      localStorage.setItem("username", username);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid credentials"));
  },
  logout: () => {
    localStorage.removeItem("username");
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem("username")
      ? Promise.resolve()
      : Promise.reject();
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("username");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getIdentity: () => {
    const username = localStorage.getItem("username");
    return Promise.resolve({
      id: username || "unknown",
      fullName: username || "Unknown User",
    });
  },
  getPermissions: () => Promise.resolve("admin"),
};
