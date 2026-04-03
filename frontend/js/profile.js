import { User } from "./class/User.js";

const user = new User();
const PROFILE_KEY = "PROFILE_DATA";

// ===== STORAGE =====
function getProfileData() {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY)) || {};
}

function saveProfileData(newData) {
    const currentData = getProfileData();
    const updated = { ...currentData, ...newData };
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
}

// ===== MAIN =====
document.addEventListener("DOMContentLoaded", () => {

    const profile = getProfileData();

    // ===== STEP 1 =====
    const next1Btn1 = document.querySelector("#next1-btn1");
    const next1Btn2 = document.querySelector("#next1-btn2");

    if (next1Btn1 || next1Btn2) {
        const name = document.querySelector("#name");
        const location = document.querySelector("#location");

        const handleNext = (url) => (e) => {
            e.preventDefault();
            if (!name.value || !location.value) {
                alert("Please fill in all required fields.");
                return;
            }
            saveProfileData({ name: name.value, location: location.value });
            window.location.href = url;
        };

        next1Btn1?.addEventListener("click", handleNext("client-profile2.html"));
        next1Btn2?.addEventListener("click", handleNext("jobseeker-profile2.html"));
    }

    // ===== STEP 2 =====
    const items = document.querySelectorAll(".service-item");
    let selectedService = profile.selectedService || "";

    if (items.length) {
        items.forEach(item => {
            if (item.dataset.value === selectedService.value) {
                item.classList.add("active");
            }

            item.addEventListener("click", () => {
                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                selectedService = {
                    value: item.dataset.value,
                    title: item.querySelectorAll("div")[1].textContent.trim()
                };
            });
        });
    }

    const next2Btn = document.querySelector("#next2-btn2");
    if (next2Btn) {
        next2Btn.addEventListener("click", (e) => {
            e.preventDefault();
            const aboutYou = document.querySelector("#about-you").value;

            if (!aboutYou || !selectedService) {
                alert("Please fill in all required fields.");
                return;
            }

            saveProfileData({ selectedService, aboutYou });
            window.location.href = "jobseeker-profile3.html";
        });
    }

    // ===== STEP 3 =====
    const experienceSelect = document.querySelector("#experience-years");
    const hourlyRateSelect = document.querySelector("#hourly-rate");
    const aboutExperienceTextarea = document.querySelector("#about-experience");

    let selectedSkills = profile.selectedSkills || [];

    experienceSelect?.addEventListener("change", () => {
        saveProfileData({ experience: experienceSelect.value });
    });

    hourlyRateSelect?.addEventListener("change", () => {
        saveProfileData({ hourlyRate: hourlyRateSelect.value });
    });

    aboutExperienceTextarea?.addEventListener("input", () => {
        saveProfileData({ aboutExperience: aboutExperienceTextarea.value });
    });

    const skillButtons = document.querySelectorAll(".skills");

    skillButtons.forEach(btn => {
        const skill = btn.textContent.trim();

        // restore
        if (selectedSkills.includes(skill)) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
            btn.classList.toggle("active");

            if (selectedSkills.includes(skill)) {
                selectedSkills = selectedSkills.filter(s => s !== skill);
            } else {
                selectedSkills.push(skill);
            }

            saveProfileData({ selectedSkills });
        });
    });

    const next3Btn = document.querySelector("#next3-btn2");

    if (next3Btn) {
        next3Btn.addEventListener("click", (e) => {
            e.preventDefault();

            const experience = experienceSelect?.value;
            const hourlyRate = hourlyRateSelect?.value;
            const aboutExperience = aboutExperienceTextarea?.value;

            if (!experience || !hourlyRate || !aboutExperience || selectedSkills.length === 0) {
                alert("Please fill in all required fields.");
                return;
            }

            saveProfileData({ experience, hourlyRate, aboutExperience, selectedSkills });
            window.location.href = "jobseeker-profile4.html";
        });
    }

    // ===== REVIEW PAGE =====
    if (document.querySelector("#name-review")) {

        document.getElementById("name-review").textContent = profile.name || "";
        document.getElementById("location-review").innerHTML = '<i class="bi bi-geo-alt" style="color: #5A3AB0;"></i> ' + profile.location || "";
        document.getElementById("service-review").textContent = profile.selectedService.title;
        document.getElementById("rate-review").textContent = profile.hourlyRate;
        document.getElementById("experience-review").textContent = profile.experience + " experience";
        // skills
        const skillsContainer = document.getElementById("skills-review");
        skillsContainer.innerHTML = "";

        (profile.selectedSkills || []).forEach(skill => {
            const span = document.createElement("span");
            span.setAttribute("class", "skill-item");
            span.innerHTML = '<i class="bi bi-check-lg"></i> ' + skill;
            span.classList.add("active");
            skillsContainer.appendChild(span);
        });

        // about
        document.getElementById("about-you-review").textContent =
            profile.aboutYou || "";
    }

});