import { User } from "./class/User.js";
const user = new User()
const email_input = document.querySelector('#email');
const password_input = document.querySelector('#password');
const role_input = document.querySelector('#role');

let selectedRole = "";
document.querySelectorAll(".role-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const selectedRole = btn.dataset.role;
        document.getElementById("role").value = selectedRole;
    });
});

document.querySelector('#signup-btn').addEventListener('click',(event) => {
  event.preventDefault()
  const email = email_input.value
  const password = password_input.value
  const role = role_input.value

  user.register(email, password, role).then(user => {
    window.location.href="login.html"
  }).catch(error => {
    alert(error)
  })
})