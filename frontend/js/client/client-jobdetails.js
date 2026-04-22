// ===== CLIENT'S JOBDETAILS ===== //
    // == JOB DETAILS == //
// const selectedJob = JSON.parse(sessionStorage.getItem("selectedJob"));
// const container = document.querySelector(".jobpost-details")
// const div = document.createElement("div");
//     div.classList.add("jobs-card");     
//     div.innerHTML = `
//         <div class="job-top">
//             <h3>${selectedJob.service_title}</h4>    ← crashes here if selectedJob is null so
//  i fixed it wrap it in a null check 
//         </div>
//         <p class="job-time">${selectedJob.service_schedule}</p>
//         <p class="apply-location">
//             <img src="./Assets/location_on.png" class="location-icon">
//             ${selectedJob.service_location} • ${selectedJob.service_pay_rate}
//         </p>
                
//     `;

// MASHAIR FIX - added null check so it doesn't crash on dashboard
import { user, job, application } from './client-shared.js';
import { BACKEND_URL } from '../config.js';
const selectedJob = JSON.parse(sessionStorage.getItem("selectedJob"));
const container = document.querySelector(".jobpost-details");
if (selectedJob && container) {
    const div = document.createElement("div");
    div.classList.add("jobs-card");
    div.innerHTML = `
        <div class="job-top">
            <h3>${selectedJob.service_title}</h3>
        </div>
        <p class="job-time">${selectedJob.service_schedule}</p>
        <p class="apply-location">
            <img src="./Assets/location_on.png" class="location-icon">
            ${selectedJob.service_location} • ${selectedJob.service_pay_rate}
        </p>
    `;
    container.appendChild(div);
}
    
    
    // APPLICANTS DETAIS == //
async function loadApplicants() {
    const currentPostId = selectedJob?.id;
    if (!currentPostId) {
    console.error("No postId");
    return;
    }
    try {
        const data = await application.getApplicants(currentPostId);
        renderApplicants(data);
    } catch (err) {
        console.error(err);
    }
}
if (document.querySelector(".Applicants")) {
    loadApplicants();
}
function renderApplicants(data) {
    const container = document.querySelector(".Applicants");
    container.innerHTML = "";
    if(!Array.isArray(data) || data.length === 0){
        const p = document.createElement("p");
        p.innerHTML = "No applicants";
        container.appendChild(p);}
    data.forEach(app => {
        let serviceTitle = app.services
        if (serviceTitle == 'cleaning'){serviceTitle='🧼 Cleaning'}
        else if (serviceTitle == 'childcare'){serviceTitle='🧸 Childcare'}
        else {serviceTitle='👴🏻 Eldercare'};
        const div = document.createElement("div");
        div.classList.add("jobs-card");
        // div.innerHTML = `  no photo fixed 
        //     <div class="applicant-status">
        //         <h3>${app.fullname}</h3>
        //         <p class="status ${app.status}">${app.status}</p>
        //         </div>
        //     <p>${app.experience}</p>
        //     <p>${serviceTitle}</p>
        //     <p>${app.skills}</p>
        //     <button class="accept-btn" data-id="${app.id}">Accept</button>
        //     <button class="reject-btn" data-id="${app.id}">Reject</button>
            
        // `;

     // MASHAIR FIX - added photo, location, status in right place
div.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
        <img src="${app.photo ? `${BACKEND_URL}/uploads/${app.photo}` : './Assets/GFE logo.png'}"
             style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
        <div>
            <h3 style="margin:0;">${app.fullname}</h3>
            <p style="margin:0; color:#572290;">${serviceTitle}</p>
        </div>
    </div>
    <p>📍 ${app.location || ''}</p>
    <p>⭐ ${app.experience || ''}</p>
    <p>${app.skills || ''}</p>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <span class="status ${app.status}">${app.status}</span>
        <div>
            <button class="accept-btn" data-id="${app.id}">Accept</button>
            <button class="reject-btn" data-id="${app.id}">Reject</button>
        </div>
    </div>
`;     div.querySelector(".accept-btn").addEventListener("click", async() => {
            console.log("ACCEPT CLICK", app.id);
            await updateStatus(app.id, "accepted");
            await loadApplicants();
        });

        div.querySelector(".reject-btn").addEventListener("click", async() => {
            await updateStatus(app.id, "rejected");
            await loadApplicants();
        });
        container.appendChild(div);
    });
}



async function updateStatus(appId,status) {
  try {
    const response = await application.updateStatus(appId,status); 
    return response;
  } catch (err) {
    console.error(err);
  }
}