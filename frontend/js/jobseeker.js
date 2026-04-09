import { User } from "./class/User.js";
import { Job } from "./class/Job.js";
const user = new User();
const job = new Job();
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

document.addEventListener("DOMContentLoaded", () => {
    const profile = getProfileData();

    // ===== JOBSEEKER PROFILE STEP 1 =====
    // == location selection ==
        const dropdown = document.getElementById("locationDropdown");
        const city = document.getElementById("city");
        const district = document.getElementById("district");
        const data = {
        Helsinki: [
            "Keskusta", "Kallio", "Pasila", "Itäkeskus", "Kamppi",
            "Meilahti", "Lauttasaari", "Vuosaari", "Malmi", "Haaga"
        ],

        Espoo: [
            "Tapiola", "Leppävaara", "Otaniemi", "Matinkylä", "Espoonlahti",
            "Olari", "Kivenlahti", "Niittykumpu", "Soukka", "Laajalahti"
        ],

        Vantaa: [
            "Tikkurila", "Myyrmäki", "Korso", "Hakunila", "Aviapolis",
            "Martinlaakso", "Koivukylä", "Pakkala", "Ylästö", "Rekola"
        ],

        Tampere: [
            "Keskusta", "Hervanta", "Tammela", "Kaleva", "Lielahti",
            "Tesoma", "Pyynikki", "Nekala", "Rahola", "Messukylä"
        ],

        Turku: [
            "Keskusta", "Varissuo", "Runosmäki", "Skanssi", "Nummi",
            "Kupittaa", "Pansio", "Hirvensalo", "Raunistula", "Halinen"
        ],

        Oulu: [
            "Keskusta", "Kaakkuri", "Linnanmaa", "Tuira", "Rajakylä",
            "Pateniemi", "Hiukkavaara", "Maikkula", "Haukipudas", "Oulunsalo"
        ]
        };
    const location = document.getElementById("location");
    if(location){
        location.addEventListener("click", () => {
        dropdown.classList.toggle("d-none");
        });
        city.addEventListener("change", () => {
        const selectedCity = city.value;

        district.innerHTML = `<option value="">Select district</option>`;

        if (data[selectedCity]) {
            data[selectedCity].forEach(d => {
            const option = document.createElement("option");
            option.value = d;
            option.textContent = d;
            district.appendChild(option);
            });
        }
        });
        district.addEventListener("change", () => {
        if (city.value && district.value) {
            location.value = `${city.value} - ${district.value}`;
            dropdown.classList.add("d-none");
        }
        });
        document.addEventListener("click", (e) => {
        if (!document.querySelector(".location-wrapper").contains(e.target)) {
            dropdown.classList.add("d-none");
        }
        });        
    };
    const next1Btn2 = document.querySelector("#next1-btn2");

    if (next1Btn2) {
        const name = document.querySelector("#name");
        const email = document.querySelector("#contact-email");
        
        const phone = document.querySelector("#contact-phone");

        next1Btn2.addEventListener("click", (event) => {
            event.preventDefault();
            if (!name.value || !email.value || !phone.value || !location.value) {
                alert("Please fill in all required fields.");
                return;
            }
            saveProfileData({ name: name.value, email: email.value, phone: phone.value, location: location.value });
            window.location.href = "jobseeker-profile2.html";
        });
    }

    // ===== JOBSEEKER PROFILE STEP 2 =====
    const items = document.querySelectorAll(".service-item");
    let selectedService = profile.selectedService || "";
    if (items.length) {
        items.forEach(item => {
            if (item.dataset.value === selectedService.type) {
                item.classList.add("active");
            }
            item.addEventListener("click", () => {
                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                selectedService = {
                    type: item.dataset.value,
                    title: item.querySelectorAll("div")[1].textContent.trim()
                };
            });
        });
    }

    const next2Btn2 = document.querySelector("#next2-btn2");
    if (next2Btn2) {
        next2Btn2.addEventListener("click", (e) => {
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

    // ===== JOBSEEKER PROFILE STEP 2 =====
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

    const next3Btn2 = document.querySelector("#next3-btn2");

    if (next3Btn2) {
        next3Btn2.addEventListener("click", (e) => {
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

    // ===== JOBSEEKERREVIEW PAGE ===== //
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

    const submitBtn2 = document.querySelector("#submit-profile-btn2");
    if (submitBtn2) {
        submitBtn2.addEventListener("click", (event) => {
            event.preventDefault();
            const fullname = profile.name;
            const contact_email = profile.email;
            const contact_phone = profile.phone;
            const location = profile.location;
            const services = profile.selectedService.type;
            const about_you = profile.aboutYou;
            const experience = profile.experience;
            const hourly_rate = profile.hourlyRate;
            const about_experience = profile.aboutExperience;
            const skills = profile.selectedSkills.join(", ");
            user.updateProfile(fullname, contact_email, contact_phone, location, services, about_you, experience, hourly_rate, about_experience, skills).then(updatedUser => {
                window.location.href = "jobseeker-dashboard.html"; 
                sessionStorage.removeItem(PROFILE_KEY);
                alert("Profile submitted successfully!");
            }).catch(error => {alert("Error submitting profile: " + error);
            });
        });
    }
    // JOBSEEKER-JOB-OFFERS PAGE
    async function loadJobs() {
        document.querySelectorAll(".service-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                document.querySelectorAll(".service-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const jobsByService = btn.dataset.filter;
                let jobpostsList = await job.getJobByService(jobsByService); 
                renderjobsByService(jobpostsList); 
            });
        });
    };
    loadJobs();
    function renderjobsByService(list) {  
        const container = document.getElementById("job-list");
        container.innerHTML = "";
        list.forEach(job => {
            const div = document.createElement("div");
            div.classList.add("job-card");     
            div.innerHTML = `
                <div class="job-top">
                    <h4>${job.service_title}</h4>
                    <img src="./Assets/Heart@2x.png" class="heart-icon">
                </div>
                <p class="job-time">${job.service_schedule}</p>
                <p class="apply-location">
                    <img src="./Assets/location_on.png" class="location-icon">
                    ${job.service_location} • ${job.service_pay_rate}
                </p>
                <p class="job-desc">${job.service_description}</p>       
                <div class="job-bottom">
                    <button class="details-btn">View details</button>
                </div>
            `;
            container.appendChild(div);
        });
        document.querySelectorAll(".heart-icon").forEach(icon => {
            const jobCard = icon.closest(".job-card");
            const jobTitle = jobCard.querySelector("h4").textContent;
            const jobTime = jobCard.querySelector(".job-time").textContent;
            const jobLocation = jobCard.querySelector(".apply-location").textContent.trim();
            const jobDesc = jobCard.querySelector(".job-desc").textContent.trim();

            let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
            if (savedJobs.find(j => j.title === jobTitle)) {
            icon.src = "./Assets/filled-heart.png";
            }

            icon.addEventListener("click", () => {
                let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
                if (icon.src.includes("Heart@2x")) {
                    icon.src = "./Assets/filled-heart.png";
                    savedJobs.push({ title: jobTitle, time: jobTime, location: jobLocation, desc: jobDesc });
                } else {
                    icon.src = "./Assets/Heart@2x.png";
                    savedJobs = savedJobs.filter(j => j.title !== jobTitle);
                }
                localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
            });
        });        

        document.querySelectorAll(".details-btn").forEach(btn => {
            btn.addEventListener("click", () => {
            window.location.href = "jobseeker-job-details-page.html";
            });
        });
        
    };
    
});  