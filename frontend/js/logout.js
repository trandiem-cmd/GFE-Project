import { User } from "./class/User.js"; 

document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll(".logout-action");

  logoutButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      const user = new User();
      await user.logout();

      window.location.href = "index.html";
    });
  });
});