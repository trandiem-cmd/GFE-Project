import { User } from "./class/User.js";

const user = new User();
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

document.querySelector('#login-btn1').addEventListener('click',(event) => {
  event.preventDefault()
  const email = email_input.value
  const password = password_input.value
  const role = role_input.value

  user.login(email, password, role).then(user => {
    window.location.href="client-profile1.html"
  }).catch(error => {
    alert(error)
  })
})

document.querySelector('#login-btn2').addEventListener('click',(event) => {
  event.preventDefault()
  const email = email_input.value
  const password = password_input.value
  const role = role_input.value

  user.login(email, password, role).then(user => {
    window.location.href="jobseeker-profile1.html"
  }).catch(error => {
    alert(error)
  })
})