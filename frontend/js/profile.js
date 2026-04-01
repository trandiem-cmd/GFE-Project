import { User } from "./class/User.js";
const user = new User();
const PROFILE_KEY = "PROFILE_DATA";
const JOBPOST_KEY = "";
// lấy data cũ (nếu có)
function getProfileData() {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY)) || {};
}

// lưu data
function saveProfileData(newData) {
    const currentData = getProfileData(); //object
    const updated = { ...currentData, ...newData };
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(updated)); //lưu vào sessionStorage dưới dạng chuỗi JSON
    console.log("Saved data:", updated);
    console.log("From sessionStorage:", sessionStorage.getItem(PROFILE_KEY));
}

// clear sau khi submit
function clearProfileData() {
    sessionStorage.removeItem(PROFILE_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#next1-btn1").addEventListener("click", (event) => {
        event.preventDefault()
        const name = document.querySelector("#name").value;
        const location = document.querySelector("#location").value;
        if (!name || !location) {
            alert("Please fill in all required fields.");
            return;
        }
        saveProfileData({ name, location });
        window.location.href = "client-profile2.html";
    });
});
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("next1-btn2").addEventListener("click", (event) => {
        event.preventDefault()
        const name = document.querySelector("#name").value;
        const location = document.querySelector("#location").value;
        if (!name || !location) {
            alert("Please fill in all required fields.");
            return;
        }
        saveProfileData({ name, location });
        window.location.href = "jobseeker-profile2.html";
    });  
    const items = document.querySelectorAll(".service-item");
    let selectedService = "";
    items.forEach(item => {
        item.addEventListener("click", () => {
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            selectedService = item.dataset.value;
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#next2-btn2").addEventListener("click", (event) => {
        event.preventDefault()
        const aboutYou = document.querySelector("#about-you").value;
        if (!aboutYou) {
            alert("Please fill in all required fields.");
            return;
        }
        saveProfileData({ selectedService, aboutYou });
        window.location.href = "jobseeker-profile3.html";
    });
});
    const experienceSelect = document.querySelector("#experience-years");
    experienceSelect.addEventListener("change", () => {
        const experience = experienceSelect.value;
        saveProfileData({ experience });
    });
    const hourlyRateSelect = document.querySelector("#hourly-rate");
    hourlyRateSelect.addEventListener("change", () => {
        const hourlyRate = hourlyRateSelect.value;
        saveProfileData({ hourlyRate });
    });
    const aboutExperienceTextarea = document.querySelector("#about-experience");
    aboutExperienceTextarea.addEventListener("input", () => {
        const aboutExperience = aboutExperienceTextarea.value;
        saveProfileData({ aboutExperience });
    });
    const skillButtons = document.querySelectorAll(".skills");
    let selectedSkills = [];
    skillButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            const skill = btn.textContent.trim();
            if (selectedSkills.includes(skill)) {
            selectedSkills = selectedSkills.filter(s => s !== skill);
            } else {
            selectedSkills.push(skill);
            }
            saveProfileData({ selectedSkills });
        });
    });   
document.addEventListener("DOMContentLoaded", () => { 
    document.querySelector("#next3-btn2").addEventListener("click", (event) => {
        event.preventDefault();
        const experience = document.querySelector("#experience-years").value;
        const hourlyRate = document.querySelector("#hourly-rate").value;
        const aboutExperience = document.querySelector("#about-experience").value;
        const selectedSkills = JSON.parse(sessionStorage.getItem(PROFILE_KEY)).selectedSkills || [];
        if (!experience|| !hourlyRate || !aboutExperience || selectedSkills.length === 0) {
            alert("Please fill in all required fields.");
            return;
        }
        saveProfileData({ experience, hourlyRate, aboutExperience, selectedSkills });
        window.location.href = "jobseeker-profile4.html";
       
    }); 
});
document.addEventListener("DOMContentLoaded", () => {
    const profile = getProfileData();
    // Name, location, service, hourly rate
    document.getElementById("name-review").innerHTML = profile.name;
    document.getElementById("location-review").innerHTML = profile.location;
    document.getElementById("service-review").innerHTML = profile.selectedService;
    document.getElementById("rate-review").innerHTML = profile.hourlyRate;

    // Skills
    const skillsContainer = document.getElementById("skills-review");
   
    skillsContainer.innerHTML = "";
    profile.selectedSkills.forEach(skill => {
        const span = document.createElement("span");
        span.textContent = skill;
        span.classList.add("active");
        skillsContainer.appendChild(span);
    });
   

    // About you / Experience description
    document.getElementById("about-you-review").textContent = profile.aboutYou;
});