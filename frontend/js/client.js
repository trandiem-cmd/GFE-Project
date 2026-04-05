import { User } from "./class/User.js";
import { Job } from "./class/Job.js";
const user = new User();
const job = new Job();


const PROFILE_KEY = "PROFILE_DATA";
const JOBPOST_KEY = "JOBPOST_DATA";

// ===== STORAGE =====
function getProfileData() {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY)) || {};
}
function saveProfileData(newData) {
    const currentData = getProfileData();
    const updated = { ...currentData, ...newData };
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
}

function getJobpostData() {
    return JSON.parse(sessionStorage.getItem(JOBPOST_KEY)) || {};
}
function saveJobpostData(newData) {
    const currentData = getJobpostData(); //object
    const updated = { ...currentData, ...newData };
    sessionStorage.setItem(JOBPOST_KEY, JSON.stringify(updated));
};



document.addEventListener("DOMContentLoaded", () => {
    const profile = getProfileData();

    // ===== CLIENT STEP 1 =====
   
    const next1Btn1 = document.querySelector("#next1-btn1");

    if (next1Btn1) {
        const name = document.querySelector("#name");
        const email = document.querySelector("#contact-email");
        const location = document.querySelector("#location");
        const phone = document.querySelector("#contact-phone");

        next1Btn1.addEventListener("click", (event) => {
            event.preventDefault();
            if (!name.value || !email.value || !phone.value || !location.value) {
                alert("Please fill in all required fields.");
                return;
            }
            saveProfileData({ name: name.value, email: email.value, phone: phone.value, location: location.value });
            window.location.href = "client-profile2.html";
        });
    }
    // ===== CLIENT STEP 2 =====
    const jobpost = getJobpostData();
    const items = document.querySelectorAll(".service-item");
    let selectedService = jobpost.selectedService || "";

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


    const next2Btn1 = document.querySelector("#next2-btn1");
    if (next2Btn1) {
        next2Btn1.addEventListener("click", (e) => {
            e.preventDefault();
            const serviceTitle = document.querySelector("#service-title").value;
            const serviceDescription = document.querySelector("#service-description").value;
            if (!serviceTitle || !serviceDescription || !selectedService) {
                alert("Please fill in all required fields.");
                return;
            }
            saveJobpostData({ selectedService, serviceTitle, serviceDescription });
            console.log(getJobpostData());
            window.location.href = "client-profile3.html";  
        });
    }


// ===== CLIENT STEP 3 =====
    const next3Btn1 = document.querySelector("#next3-btn1");
    const frequencyItems = document.querySelectorAll(".frequency-btn");
    let serviceFrequency = jobpost.serviceFrequency || "";

    if (frequencyItems.length) {
        frequencyItems.forEach(item => {
            if (item.dataset.value === serviceFrequency) {
                item.classList.add("active");
            }

            item.addEventListener("click", () => {
                frequencyItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                serviceFrequency = {
                    type: item.dataset.value,
                    title: item.textContent.trim()
                };
            });
        });
    }
    

    if (next3Btn1) {
        const serviceScheduleInput = document.querySelector("#service-schedule");
        const serviceLocationInput = document.querySelector("#service-location");
        const servicePayRateInput = document.querySelector("#service-pay-rate");
        next3Btn1.addEventListener("click", (e) => {
        e.preventDefault();
        const serviceSchedule = serviceScheduleInput?.value;
        const serviceLocation = serviceLocationInput?.value;
        const servicePayRate = servicePayRateInput?.value;
        if (!serviceSchedule || !serviceFrequency || !serviceLocation || !servicePayRate) {
            alert("Please fill in all required fields.");
            return;
        }
        saveJobpostData({ serviceSchedule, serviceFrequency, serviceLocation, servicePayRate });
        
        window.location.href = "client-profile4.html";
    });
    }
    // ===== CLIENT REVIEW PAGE =====

    if (document.querySelector("#info-review")) {
        document.getElementById("service-title-review").textContent = jobpost.serviceTitle;
        document.getElementById("service-description-review").textContent = jobpost.serviceDescription || "";
        document.getElementById("service-schedule-review").textContent = jobpost.serviceSchedule|| "";
        document.getElementById("frequency-review").textContent = jobpost.serviceFrequency.title || "";
        document.getElementById("service-location-review").textContent = jobpost.serviceLocation || "";
        document.getElementById("service-pay-rate-review").textContent = jobpost.servicePayRate || "";
    }
    const submitBtn1 = document.querySelector("#submit-profile-btn1");
    if (submitBtn1) {
        submitBtn1.addEventListener("click", async(event) => {
            event.preventDefault();
            const fullname = profile.name;
            const contact_email = profile.email;
            const contact_phone = profile.phone;
            const location = profile.location;
            const service_type = jobpost.selectedService.type;
            const service_title = jobpost.serviceTitle;
            const service_description = jobpost.serviceDescription;
            const service_schedule = jobpost.serviceSchedule;
            const service_frequency = jobpost.serviceFrequency.type;
            const service_location = jobpost.serviceLocation;
            const service_pay_rate = jobpost.servicePayRate;

            try{
                await user.updateProfile(fullname, contact_email, contact_phone, location)
                await job.jobpost(service_type, service_title, service_description, service_schedule, service_frequency, service_location, service_pay_rate);
                sessionStorage.removeItem(JOBPOST_KEY);
                sessionStorage.removeItem(PROFILE_KEY);
                alert("Job posted successfully!");
                window.location.href = "client-dashboard.html"; 
            } catch(error) {alert("Error posting job: " + error);
            }
            

        });
    };
    
});