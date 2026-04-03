const BACKEND_URL = "http://localhost:3000";

class User {

  // 🔹 REGISTER
  async register(email, password, role) {
    try {
      const response = await fetch(`${BACKEND_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Register error:", error);
    }
  }

  // 🔹 LOGIN
  async login(email, password, role) {
    try {
      const response = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();

      // save token (optional)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;

    } catch (error) {
      console.error("Login error:", error);
    }
  }

}

export default new User();