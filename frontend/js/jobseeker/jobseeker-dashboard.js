import { user, job, application } from './jobseeker-shared.js';
import { BACKEND_URL } from '../config.js';
// MASHAIR - dashboard page: hello name, photo, activity buttons (new feature)
// // MASHAIR FIX - fetch photo directly using token from sessionStorage
const welcomeName = document.getElementById('welcomeName');
if (welcomeName) {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (currentUser) {
        const name = currentUser.fullname ? currentUser.fullname.split(' ')[0] : currentUser.email.split('@')[0];
        welcomeName.textContent = `Hello, ${name} 👋`;

        fetch(`${BACKEND_URL}/user/${currentUser.id}`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.photo) {
                const profilePic = document.getElementById('profilePic');
                if (profilePic) profilePic.src = `${BACKEND_URL}/uploads/${data.photo}`;
            }
        });
    }
    // MASHAIR - load real activity numbers from DB
if (document.getElementById('applicationsBtn')) {
    // get applications count
    application.getApplications('all').then(apps => {
        const appDiv = document.getElementById('applicationsBtn').querySelector('div');
        appDiv.innerHTML = `${apps.length}<br>Applications`;
    }).catch(err => console.error(err));

    // get accepted count
    application.getApplications('accepted').then(apps => {
        const acceptedDiv = document.getElementById('acceptedBtn').querySelector('div');
        acceptedDiv.innerHTML = `${apps.length}<br>Accepted`;
    }).catch(err => console.error(err));

    // get messages count
    user.getMessages(currentUser.id).then(messages => {
        const msgDiv = document.getElementById('messagesBtn').querySelector('div');
        msgDiv.innerHTML = `${messages.length}<br>Messages`;
    }).catch(err => console.error(err));
}
/*
// MASHAIR - load recommended jobs matching jobseeker's service
if (document.getElementById('recommended-jobs')) {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    // get jobseeker profile to find their service
    fetch(`http://localhost:3001/user/${currentUser.id}`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
    })
    .then(res => res.json())
    .then(userData => {
        if (userData.services) {
            // load jobs matching their service
            job.getJobByService(userData.services).then(jobs => {
                const container = document.getElementById('recommended-jobs');
                container.innerHTML = '';
                if (jobs.length === 0) {
                    container.innerHTML = '<p style="padding:10px; color:#572290;">No recommended jobs yet!</p>';
                    return;
                }
                // show only first 2
                jobs.slice(0, 2).forEach(j => {
                    const div = document.createElement('div');
                    div.className = 'job-card';
                    div.innerHTML = `
                        <div class="job-top">
                            <h4>${j.service_title}</h4>
                        </div>
                        <p class="job-time">${j.service_schedule}</p>
                        <p class="apply-location">
                            <img src="./Assets/location_on.png" class="location-icon">
                            ${j.service_location} • ${j.service_pay_rate}
                        </p>
                        <p class="job-desc">${j.service_description}</p>
                        <div class="job-bottom">
                            <button class="apply-btn">Apply Now</button>
                        </div>
                    `;
                    div.querySelector('.apply-btn').addEventListener('click', () => {
                        sessionStorage.setItem('selectedJob', JSON.stringify(j));
                        window.location.href = 'jobseeker-apply-page.html';
                    });
                    container.appendChild(div);
                });
            });
        }
    });
}
*/
        

async function loadJobs() {
        let allJobs = await job.getAllJob();
        renderjobsByService(allJobs);
    }

    if (document.getElementById("recommended-jobs")) {
        await loadJobs();
        const currentUser = JSON.parse(sessionStorage.getItem('user'));
        // get jobseeker profile to find their service
        fetch(`${BACKEND_URL}/user/${currentUser.id}`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        })
        .then(res => res.json())
        .then(userData => {
            const service = userData.services.toLowerCase();
            const location = userData.location.split("-")[0].trim().toLowerCase();
            document.querySelectorAll('.job-card').forEach(card => {
                card.style.display = 'none';
                const title = card.querySelector('h4') ? card.querySelector('h4').textContent.toLowerCase() : '';
                const loc = card.querySelector('.apply-location') ? card.querySelector('.apply-location').textContent.toLowerCase() : '';
                const match = title.includes(service) && loc.includes(location);
                card.style.display = match ? 'block' : 'none';
            });
        })
    }

   // DIEM - render jobs function
    function renderjobsByService(list) {
        const container = document.getElementById("recommended-jobs");
        container.innerHTML = "";
        // MASHAIR FIX - use user-specific key so saved jobs don't mix between users
        const currentUser = JSON.parse(sessionStorage.getItem('user'));
        const savedJobsKey = `savedJobs_${currentUser.id}`;
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
                    <button class="apply-btn">Apply Now</button>
                </div>
            `;
            container.appendChild(div);

            const applyBtn = div.querySelector(".apply-btn");
            applyBtn.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.setItem("selectedJob", JSON.stringify(job));
                window.location.href = "jobseeker-apply-page.html";
            });

            // MASHAIR FIX - select icon from current card only
            const icon = div.querySelector('.heart-icon');
            const jobTitle = job.service_title;
            const jobTime = job.service_schedule;
            const jobLocation = job.service_location;
            const jobDesc = job.service_description;

            let savedJobs = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
            if (savedJobs.find(j => j.title === jobTitle)) {
                icon.src = "./Assets/filled-heart.png";
            }

            icon.addEventListener("click", () => {
                let savedJobs = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
                if (icon.src.includes("Heart@2x")) {
                    icon.src = "./Assets/filled-heart.png";
                    savedJobs.push({ title: jobTitle, time: jobTime, location: jobLocation, desc: jobDesc });
                } else {
                    icon.src = "./Assets/Heart@2x.png";
                    savedJobs = savedJobs.filter(j => j.title !== jobTitle);
                }
                localStorage.setItem(savedJobsKey, JSON.stringify(savedJobs));
            });
        });
    }
    
    const applicationsBtn = document.getElementById('applicationsBtn');
    const messagesBtn = document.getElementById('messagesBtn');
    const acceptedBtn = document.getElementById('acceptedBtn');
    if (applicationsBtn) applicationsBtn.addEventListener('click', () => location.href = 'jobseeker-application.html');
    if (messagesBtn) messagesBtn.addEventListener('click', () => location.href = 'jobseeker-inbox.html');
    if (acceptedBtn) acceptedBtn.addEventListener('click', () => location.href = 'jobseeker-application.html');

    document.querySelectorAll(".heart-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            if (icon.src.includes("Heart@2x")) {
                icon.src = "./Assets/filled-heart.png";
            } else {
                icon.src = "./Assets/Heart@2x.png";
            }
        });
    });
}