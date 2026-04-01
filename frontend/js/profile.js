import { User } from "./class/User.js";
const user = new User();
const PROFILE_KEY = "";

// lấy data cũ (nếu có)
function getProfileData() {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
}

// lưu data
function saveProfileData(newData) {
    const currentData = getProfileData(); //object
    const updated = { ...currentData, ...newData };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated)); //lưu vào localStorage dưới dạng chuỗi JSON
}

// clear sau khi submit
function clearProfileData() {
    localStorage.removeItem(PROFILE_KEY);
}

const userFromStorage = localStorage.getItem('user');

document.querySelector("#next-btn").addEventListener("click", () => {
    const name = document.querySelector("#name").value;
    const location = document.querySelector("#location").value;

    saveProfileData({ name, location });

});

const role = JSON.parse(userFromStorage).role; // "client" hoặc "jobseeker"

document.getElementById("next-btn").addEventListener("click", () => {
if(role === "client") {
        let currentPage = window.location.pathname;
        let nextPage;
        if (currentPage.includes("profile1")) {
            nextPage = "client-profile2.html";
        } else if (currentPage.includes("profile2")) {
            nextPage = "client-profile3.html";
        } else if (currentPage.includes("profile3")) {
            nextPage = "client-profile4.html";
        }
        window.location.href = `./${nextPage}`;
    } else if(role === "jobseeker") {
               let currentPage = window.location.pathname;
        let nextPage;
        if (currentPage.includes("profile1")) {
            nextPage = "jobseeker-profile2.html";
        } else if (currentPage.includes("profile2")) {
            nextPage = "jobseeker-profile3.html";
        } else if (currentPage.includes("profile3")) {
            nextPage = "jobseeker-profile4.html";
        }
        window.location.href = `./${nextPage}`;
    }
});

const items = document.querySelectorAll(".service-item");
let selectedService = "childcare";

items.forEach(item => {
item.addEventListener("click", () => {
    items.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    selectedService = item.dataset.value;
});
});