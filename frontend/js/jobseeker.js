import { User } from "./class/User.js";
import { Job } from "./class/Job.js";
import { Application } from "./class/Application.js";
const user = new User();
const job = new Job();
const application = new Application();
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

// MASHAIR - menu works on all pages (new feature)
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
if (menuBtn) menuBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "flex";
});
if (closeBtn) closeBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "none";
});

// MASHAIR - dashboard page: hello name, photo, activity buttons (new feature)
// // MASHAIR FIX - fetch photo directly using token from sessionStorage
const welcomeName = document.getElementById('welcomeName');
if (welcomeName) {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (currentUser) {
        const name = currentUser.fullname ? currentUser.fullname.split(' ')[0] : currentUser.email.split('@')[0];
        welcomeName.textContent = `Hello, ${name} 👋`;

        fetch(`http://localhost:3001/user/${currentUser.id}`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.photo) {
                const profilePic = document.getElementById('profilePic');
                if (profilePic) profilePic.src = `http://localhost:3001/uploads/${data.photo}`;
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

// MASHAIR - search bar on job offers page (new feature)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const search = this.value.toLowerCase();
        document.querySelectorAll('.job-card').forEach(card => {
            const title = card.querySelector('h4') ? card.querySelector('h4').textContent.toLowerCase() : '';
            const desc = card.querySelector('.job-desc') ? card.querySelector('.job-desc').textContent.toLowerCase() : '';
            const loc = card.querySelector('.apply-location') ? card.querySelector('.apply-location').textContent.toLowerCase() : '';
            card.style.display = (title.includes(search) || desc.includes(search) || loc.includes(search)) ? 'block' : 'none';
        });
    });
}

// MASHAIR - saved jobs page
const savedContainer = document.getElementById('savedContainer');
if (savedContainer) {
    function loadSavedJobs() {
        // MASHAIR FIX - use user-specific key so saved jobs don't mix between users
        const currentUser = JSON.parse(sessionStorage.getItem('user'));
        const savedJobsKey = `savedJobs_${currentUser.id}`;
        const savedJobs = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
        savedContainer.innerHTML = "";
        if (savedJobs.length === 0) {
            savedContainer.innerHTML = "<p style='text-align:center; color:#572290; margin-top:20px;'>No saved jobs yet!</p>";
            return;
        }
        savedJobs.forEach(job => {
            const card = document.createElement("div");
            card.className = "job-card";
            card.innerHTML = `
                <div class="job-top">
                    <h4>${job.title}</h4>
                    <img src="./Assets/filled-heart.png" class="heart-icon">
                </div>
                <p class="job-time">${job.time}</p>
                <p>
                    <img src="./Assets/location_on.png" class="location-icon">
                    ${job.location}
                </p>
                <p class="job-desc">${job.desc}</p>
                <div class="job-actions">
                    <button class="remove-btn">Remove</button>
                    <a href="jobseeker-apply-page.html" class="apply-btn">Apply Now</a>
                </div>
            `;
            card.querySelector(".remove-btn").addEventListener("click", () => {
                // MASHAIR FIX - use user-specific key
                let savedJobs = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
                savedJobs = savedJobs.filter(j => j.title !== job.title);
                localStorage.setItem(savedJobsKey, JSON.stringify(savedJobs));
                card.remove();
            });
            savedContainer.appendChild(card);
        });
    }
    loadSavedJobs();
}

// MASHAIR - inbox page WhatsApp style (new feature)
const messageList = document.getElementById('messageList');
if (messageList) {
    const currentUser = JSON.parse(sessionStorage.getItem('user')); // MASHAIR FIX - get logged in user
    let selectedReceiverId = null;
    let allMessages = [];

    function showList() {
        document.getElementById('listView').style.display = 'block';
        document.getElementById('chatView').style.display = 'none';
    }

    function showChat(name) {
        document.getElementById('listView').style.display = 'none';
        document.getElementById('chatView').style.display = 'block';
        document.getElementById('chatPersonName').textContent = name;
    }

    async function loadClients() {
        allMessages = await user.getMessages(currentUser.id); // MASHAIR FIX - was user.id
        const userIds = [...new Set(allMessages.map(m =>
            m.sender_id === currentUser.id ? m.receiver_id : m.sender_id // MASHAIR FIX
        ))];

        messageList.innerHTML = '';
        if (userIds.length === 0) {
            messageList.innerHTML = '<p style="padding:20px; color:#572290;">No messages yet</p>';
            return;
        }

        const clients = await user.getClients();
        const filtered = clients.filter(c => userIds.includes(c.id));

        filtered.forEach(client => {
            const unread = allMessages.filter(m => m.sender_id === client.id && m.read === false);
            const lastMsg = allMessages.filter(m =>
                (m.sender_id === client.id && m.receiver_id === currentUser.id) || // MASHAIR FIX
                (m.receiver_id === client.id && m.sender_id === currentUser.id)    // MASHAIR FIX
            ).slice(-1)[0];

            const item = document.createElement('div');
            item.className = 'message-item';
            item.innerHTML = `
                <img src="./Assets/Group 142 (2).png" class="profile-icon">
                <div>
                    <strong>${client.fullname}</strong>
                    <p>${lastMsg ? lastMsg.message_text.substring(0, 30) + '...' : 'No messages yet'}</p>
                </div>
                ${unread.length > 0 ? `<span class="badge">${unread.length}</span>` : ''}
            `;

            item.addEventListener('click', () => {
                selectedReceiverId = client.id;
                showChat(client.fullname);
                loadMessages(client.id);
            });

            messageList.appendChild(item);
        });
    }

    async function loadMessages(receiverId) {
        const messages = await user.getMessages(currentUser.id); // MASHAIR FIX - was user.id
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML = '';

        const filtered = messages.filter(msg =>
            (msg.sender_id === currentUser.id && msg.receiver_id === receiverId) || // MASHAIR FIX
            (msg.receiver_id === currentUser.id && msg.sender_id === receiverId)    // MASHAIR FIX
        );

        filtered.forEach(msg => {
            const div = document.createElement('div');
            div.className = msg.sender_id === currentUser.id ? 'chat-message right' : 'chat-message left'; // MASHAIR FIX
            div.textContent = msg.message_text;
            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const backBtn = document.getElementById('backBtn');

    if (sendBtn) {
        sendBtn.addEventListener('click', async () => {
            const message = chatInput.value.trim();
            if (message !== '' && selectedReceiverId) {
                await user.sendMessage(currentUser.id, selectedReceiverId, message); // MASHAIR FIX - was user.id
                chatInput.value = '';
                loadMessages(selectedReceiverId);
            }
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') sendBtn.click();
        });
    }

    if (backBtn) backBtn.addEventListener('click', showList);

    loadClients();
}
// MASHAIR - profile page: edit, pause, delete, change password (new feature)
const profileContainer = document.querySelector('.profile-container');
if (profileContainer) {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    const districts = {
        Helsinki: ['Kamppi', 'Kallio', 'Lauttasaari', 'Töölö', 'Pasila', 'Malmi', 'Haaga'],
        Espoo: ['Matinkylä', 'Otaniemi', 'Tapiola', 'Leppävaara', 'Espoonlahti'],
        Vantaa: ['Tikkurila', 'Myyrmäki', 'Hakunila', 'Martinlaakso'],
        Tampere: ['Kaleva', 'Pyynikki', 'Hervanta', 'Tammela'],
        Turku: ['Hirvensalo', 'Nummi', 'Runosmäki', 'Kupittaa'],
        Oulu: ['Linnanmaa', 'Rajakylä', 'Keskusta', 'Tuira']
    };

    async function loadProfile() {
        const userData = await user.getProfile(currentUser.id);
        document.getElementById('profile-name').textContent = userData.fullname ? userData.fullname.split(' ')[0] : '';
        document.getElementById('profile-service-text').textContent = userData.services || '';
        document.getElementById('profile-location-text').textContent = userData.location || '';
        document.getElementById('about-text').textContent = userData.about_you || 'No description added yet';
        document.getElementById('name-text').textContent = userData.fullname || '';
        document.getElementById('phone-text').textContent = userData.contact_phone || '';
        document.getElementById('email-text').textContent = userData.contact_email || '';
        document.getElementById('location-text').textContent = userData.location || '';
        document.getElementById('experience-text').textContent = userData.experience || '';
        document.getElementById('rate-text').textContent = userData.hourly_rate || '';

        if (userData.photo) {
            document.getElementById('profile-img').src = `http://localhost:3001/uploads/${userData.photo}`;
        }

        if (userData.is_paused) {
        document.getElementById('pauseBtn').textContent = 'Activate account';
        }

        if (userData.services) {
            document.getElementById('services-tags').innerHTML = `<span class="tag">${userData.services}</span>`;
        }

        if (userData.skills) {
            const tasksDiv = document.getElementById('skills-tasks');
            tasksDiv.innerHTML = '';
            userData.skills.split(',').forEach(skill => {
                const span = document.createElement('span');
                span.textContent = skill.trim();
                tasksDiv.appendChild(span);
            });
        }

        profileContainer.style.visibility = 'visible';
    }

    loadProfile();

    let isEditing = false;
    document.getElementById('editBtn').addEventListener('click', async function() {
        if (!isEditing) {
            isEditing = true;
            this.textContent = 'Save profile';

            const about = document.getElementById('about-text');
            about.innerHTML = `<textarea id="edit-about" style="width:100%; border:none; border-radius:8px; padding:8px; background:#e9def5; min-height:120px;">${about.innerText}</textarea>`;

            const name = document.getElementById('name-text');
            name.innerHTML = `<input id="edit-name" type="text" value="${name.innerText}" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5; width:100%;">`;

            const phone = document.getElementById('phone-text');
            phone.innerHTML = `<input id="edit-phone" type="text" value="${phone.innerText}" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5; width:100%;">`;

            const email = document.getElementById('email-text');
            email.innerHTML = `<input id="edit-email" type="email" value="${email.innerText}" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5; width:100%;">`;

            const loc = document.getElementById('location-text');
            loc.innerHTML = `
                <select id="edit-city" class="form-select mb-2" style="background:#e9def5;">
                    <option value="">Select city</option>
                    <option>Helsinki</option>
                    <option>Espoo</option>
                    <option>Vantaa</option>
                    <option>Tampere</option>
                    <option>Turku</option>
                    <option>Oulu</option>
                </select>
                <select id="edit-district" class="form-select" style="background:#e9def5;">
                    <option value="">Select district</option>
                </select>
            `;

            document.getElementById('edit-city').addEventListener('change', function() {
                const districtSelect = document.getElementById('edit-district');
                districtSelect.innerHTML = '<option value="">Select district</option>';
                if (districts[this.value]) {
                    districts[this.value].forEach(d => {
                        const opt = document.createElement('option');
                        opt.value = d;
                        opt.textContent = d;
                        districtSelect.appendChild(opt);
                    });
                }
            });

            const exp = document.getElementById('experience-text');
            exp.innerHTML = `<select id="edit-experience" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5;">
                <option>0-1 years</option>
                <option>1-3 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
            </select>`;

            const rate = document.getElementById('rate-text');
            rate.innerHTML = `<select id="edit-rate" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5;">
                <option>€10 - €15/hour</option>
                <option>€15 - €20/hour</option>
                <option>€20 - €25/hour</option>
                <option>€25+ /hour</option>
            </select>`;

            // MASHAIR FIX - service edit shows all 3 options
const servicesTag = document.getElementById('services-tags');
const currentService = document.getElementById('profile-service-text').textContent;
servicesTag.innerHTML = `
    <select id="edit-service" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5; width:100%;">
        <option value="childcare">Childcare</option>
        <option value="eldercare">Eldercare</option>
        <option value="cleaning">Cleaning</option>
    </select>
`;
document.getElementById('edit-service').value = currentService;

// MASHAIR FIX - skills edit shows all skills
const skillsDiv = document.getElementById('skills-tasks');
const currentSkills = skillsDiv.innerText.split(',').map(s => s.trim());
const allSkills = ['Babysitting', 'Child supervision', 'Meal preparation for kids', 'Homework assistance', 'Playtime activities', 'Personal care assistance', 'Medication management', 'Mobility assistance', 'Meal preparation', 'Elder companionship', 'House Cleaning', 'Surface Cleaning', 'Deep Cleaning', 'Laundry'];
skillsDiv.innerHTML = '';
allSkills.forEach(skill => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = skill;
    btn.className = currentSkills.includes(skill) ? 'skills active' : 'skills';
    btn.addEventListener('click', () => btn.classList.toggle('active'));
    skillsDiv.appendChild(btn);
});

        } else {
            isEditing = false;
            this.textContent = 'Edit your profile';

            const aboutVal = document.getElementById('edit-about').value;
            const nameVal = document.getElementById('edit-name').value;
            const phoneVal = document.getElementById('edit-phone').value;
            const emailVal = document.getElementById('edit-email').value;
            const expVal = document.getElementById('edit-experience').value;
            const rateVal = document.getElementById('edit-rate').value;
            const city = document.getElementById('edit-city').value;
            const district = document.getElementById('edit-district').value;
            const locVal = district ? `${city} - ${district}` : city;

            document.getElementById('about-text').innerHTML = aboutVal;
            document.getElementById('name-text').textContent = nameVal;
            document.getElementById('phone-text').textContent = phoneVal;
            document.getElementById('email-text').textContent = emailVal;
            document.getElementById('experience-text').textContent = expVal;
            document.getElementById('rate-text').textContent = rateVal;
            document.getElementById('location-text').textContent = locVal;
            document.getElementById('profile-location-text').textContent = city;

           // MASHAIR FIX - save service and skills too
const serviceVal = document.getElementById('edit-service').value;
const selectedSkills = [...document.getElementById('skills-tasks').querySelectorAll('button.active')]
    .map(btn => btn.textContent).join(', ');
await user.updateProfile(nameVal, emailVal, phoneVal, locVal, serviceVal, aboutVal, expVal, rateVal, null, selectedSkills);
            alert('Profile saved! ✅');
        }
    });

   document.getElementById('pauseBtn').addEventListener('click', async function() {
    const data = await user.pauseProfile();
    if (data.is_paused) {
        this.textContent = 'Activate account';
        this.style.background = '#ccc';
    } else {
        this.textContent = 'Deactivate account';
        this.style.background = '#e4dbe6';
    }
});

    document.getElementById('deleteBtn').addEventListener('click', async () => {
        if (confirm("Are you sure you want to delete your account? This cannot be undone!")) {
            await user.deleteAccount(currentUser.id);
            alert('Account deleted!');
            sessionStorage.clear();
            window.location.href = 'index.html';
        }
    });
document.getElementById('change-password-btn').addEventListener('click', async () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields!');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        const data = await user.changePassword(currentPassword, newPassword);
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Password changed successfully! ✅');
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        }
    }); // ← close change-password-btn here

    // MASHAIR - eye icon toggle for profile page password fields
    document.querySelectorAll('.toggle-pw').forEach(span => {
        span.addEventListener('click', function() {
            // MASHAIR FIX - get input from parent div
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });

    // DIEM - toggle tags
    document.querySelectorAll('.tag, .tasks span').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const profile = getProfileData();
    const currentUser = JSON.parse(sessionStorage.getItem("user")) || {}; // MASHAIR - added currentUser

    // ===== JOBSEEKER PROFILE STEP 1 =====
    const dropdown = document.getElementById("locationDropdown");
    const city = document.getElementById("city");
    const district = document.getElementById("district");
    const data = {
        Helsinki: ["Keskusta", "Kallio", "Pasila", "Itäkeskus", "Kamppi", "Meilahti", "Lauttasaari", "Vuosaari", "Malmi", "Haaga"],
        Espoo: ["Tapiola", "Leppävaara", "Otaniemi", "Matinkylä", "Espoonlahti", "Olari", "Kivenlahti", "Niittykumpu", "Soukka", "Laajalahti"],
        Vantaa: ["Tikkurila", "Myyrmäki", "Korso", "Hakunila", "Aviapolis", "Martinlaakso", "Koivukylä", "Pakkala", "Ylästö", "Rekola"],
        Tampere: ["Keskusta", "Hervanta", "Tammela", "Kaleva", "Lielahti", "Tesoma", "Pyynikki", "Nekala", "Rahola", "Messukylä"],
        Turku: ["Keskusta", "Varissuo", "Runosmäki", "Skanssi", "Nummi", "Kupittaa", "Pansio", "Hirvensalo", "Raunistula", "Halinen"],
        Oulu: ["Keskusta", "Kaakkuri", "Linnanmaa", "Tuira", "Rajakylä", "Pateniemi", "Hiukkavaara", "Maikkula", "Haukipudas", "Oulunsalu"]
    };

    const location = document.getElementById("location");
    if (location) {
        // MASHAIR - restore saved data when going back to step 1
        if (profile.name) document.getElementById("name").value = profile.name;
        if (profile.email) {
            document.getElementById("contact-email").value = profile.email;
        } else if (currentUser.email) {
            document.getElementById("contact-email").value = currentUser.email;
        }
        if (profile.phone) document.getElementById("contact-phone").value = profile.phone;
        if (profile.location) document.getElementById("location").value = profile.location;

        // DIEM - location dropdown logic
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
    }

    // MASHAIR - photo upload in step 1 (new feature)
    const photoBox = document.getElementById('photoBox');
    if (photoBox) {
        if (profile.photo) {
            const preview = document.getElementById('previewPhoto');
            preview.src = profile.photo;
            preview.style.display = 'block';
            document.querySelector('.person-icon').style.display = 'none';
            document.querySelector('.camera-icon').style.display = 'none';
        }

        photoBox.addEventListener('click', () => document.getElementById('photoInput').click());
        document.getElementById('uploadBtn').addEventListener('click', () => document.getElementById('photoInput').click());

        document.getElementById('photoInput').addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('previewPhoto');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    document.querySelector('.person-icon').style.display = 'none';
                    document.querySelector('.camera-icon').style.display = 'none';
                    const profile = JSON.parse(sessionStorage.getItem("PROFILE_DATA")) || {};
                    profile.photo = e.target.result;
                    sessionStorage.setItem("PROFILE_DATA", JSON.stringify(profile));
                };
                reader.readAsDataURL(file);

                const formData = new FormData();
                formData.append('photo', file);
                user.uploadPhoto(formData).then(data => {
                    const profile = JSON.parse(sessionStorage.getItem("PROFILE_DATA")) || {};
                    profile.photoPath = data.photo;
                    sessionStorage.setItem("PROFILE_DATA", JSON.stringify(profile));
                }).catch(err => console.error('Photo upload error:', err));
            }
        });
    }

    // DIEM - next button step 1
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
        // MASHAIR - restore about you text and save as typing
        const aboutYouField = document.querySelector("#about-you");
        if (aboutYouField) {
            if (profile.aboutYou) aboutYouField.value = profile.aboutYou;
            aboutYouField.addEventListener("input", () => {
                saveProfileData({ aboutYou: aboutYouField.value });
            });
        }

        // DIEM - service selection + MASHAIR added restore selected service
        items.forEach(item => {
            // MASHAIR - restore selected service when going back
            if (profile.selectedService && item.dataset.value === profile.selectedService.type) {
                item.classList.add("active");
            }
            // DIEM - original click handler
            item.addEventListener("click", () => {
                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                selectedService = {
                    type: item.dataset.value,
                    title: item.querySelectorAll("div")[1].textContent.trim()
                };
            });
        });

        // MASHAIR - back button step 2 (new)
        const backBtn2 = document.getElementById('back-btn');
        if (backBtn2) {
            backBtn2.addEventListener('click', () => {
                window.location.href = 'jobseeker-profile1.html';
            });
        }

        // DIEM - next button step 2
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
    }

    // ===== JOBSEEKER PROFILE STEP 3 =====
    // DIEM - original step 3 code
    const experienceSelect = document.querySelector("#experience-years");
    const hourlyRateSelect = document.querySelector("#hourly-rate");
    const aboutExperienceTextarea = document.querySelector("#about-experience");
    let selectedSkills = profile.selectedSkills || [];

    if (experienceSelect) {
        // MASHAIR - restore saved data when going back to step 3
        if (profile.experience) experienceSelect.value = profile.experience;
        if (profile.hourlyRate) hourlyRateSelect.value = profile.hourlyRate;
        if (profile.aboutExperience) aboutExperienceTextarea.value = profile.aboutExperience;

        // DIEM - save on change
        experienceSelect.addEventListener("change", () => saveProfileData({ experience: experienceSelect.value }));
        hourlyRateSelect.addEventListener("change", () => saveProfileData({ hourlyRate: hourlyRateSelect.value }));
        aboutExperienceTextarea.addEventListener("input", () => saveProfileData({ aboutExperience: aboutExperienceTextarea.value }));

        // DIEM - skills buttons
        const skillButtons = document.querySelectorAll(".skills");
        skillButtons.forEach(btn => {
            const skill = btn.textContent.trim();
            if (selectedSkills.includes(skill)) btn.classList.add("active");
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

        // MASHAIR - back button step 3 (new)
        const backBtn3 = document.getElementById('back-btn');
        if (backBtn3) {
            backBtn3.addEventListener('click', () => {
                window.location.href = 'jobseeker-profile2.html';
            });
        }

        // DIEM - next button step 3
        const next3Btn2 = document.querySelector("#next3-btn2");
        if (next3Btn2) {
            next3Btn2.addEventListener("click", (e) => {
                e.preventDefault();
                const experience = experienceSelect.value;
                const hourlyRate = hourlyRateSelect.value;
                const aboutExperience = aboutExperienceTextarea.value;
                if (!experience || !hourlyRate || !aboutExperience || selectedSkills.length === 0) {
                    alert("Please fill in all required fields.");
                    return;
                }
                saveProfileData({ experience, hourlyRate, aboutExperience, selectedSkills });
                window.location.href = "jobseeker-profile4.html";
            });
        }
    }

    // ===== JOBSEEKER PROFILE STEP 4 / REVIEW =====
    if (document.querySelector("#name-review")) {
        // MASHAIR - restore photo in review page (new)
        if (profile.photo) {
            const photoBox = document.querySelector('.photo-box');
            if (photoBox) {
                photoBox.innerHTML = `<img src="${profile.photo}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
            }
        }

        // MASHAIR - back button step 4 (new)
        const backBtn4 = document.getElementById('back-btn');
        if (backBtn4) {
            backBtn4.addEventListener('click', () => {
                window.location.href = 'jobseeker-profile3.html';
            });
        }

        // DIEM - original review page code
        document.getElementById("name-review").textContent = profile.name || "";
        document.getElementById("location-review").innerHTML = '<i class="bi bi-geo-alt" style="color: #5A3AB0;"></i> ' + (profile.location || "");

        // DIEM - original code crashes if selectedService is null:
        // document.getElementById("service-review").textContent = profile.selectedService.title;
        // MASHAIR FIX - added optional chaining to prevent crash
        document.getElementById("service-review").textContent = profile.selectedService?.title || "";

        // DIEM - original code crashes if hourlyRate/experience is null:
        // document.getElementById("rate-review").textContent = profile.hourlyRate;
        // document.getElementById("experience-review").textContent = profile.experience + " experience";
        // MASHAIR FIX - added fallback empty string to prevent crash
        document.getElementById("rate-review").textContent = profile.hourlyRate || "";
        document.getElementById("experience-review").textContent = (profile.experience || "") + " experience";

        // DIEM - skills review
        const skillsContainer = document.getElementById("skills-review");
        skillsContainer.innerHTML = "";
        (profile.selectedSkills || []).forEach(skill => {
            const span = document.createElement("span");
            span.setAttribute("class", "skill-item");
            span.innerHTML = '<i class="bi bi-check-lg"></i> ' + skill;
            span.classList.add("active");
            skillsContainer.appendChild(span);
        });

        // DIEM - about review
        document.getElementById("about-you-review").textContent = profile.aboutYou || "";
    }

    // DIEM - submit profile button
    const submitBtn2 = document.querySelector("#submit-profile-btn2");
    if (submitBtn2) {
        submitBtn2.addEventListener("click", (event) => {
            event.preventDefault();
            const fullname = profile.name;
            const contact_email = profile.email;
            const contact_phone = profile.phone;
            const location = profile.location;

            // DIEM - original crashes if selectedService is null:
            // const services = profile.selectedService.type;
            // MASHAIR FIX - added optional chaining
            const services = profile.selectedService?.type;

            const about_you = profile.aboutYou;
            const experience = profile.experience;
            const hourly_rate = profile.hourlyRate;
            const about_experience = profile.aboutExperience;

            // DIEM - original crashes if selectedSkills is null:
            // const skills = profile.selectedSkills.join(", ");
            // MASHAIR FIX - added fallback empty array
            const skills = (profile.selectedSkills || []).join(", ");

            // DIEM - original order was redirect first then alert (alert never shows)
            // user.updateProfile(...).then(updatedUser => {
            //     window.location.href = "jobseeker-dashboard.html";
            //     sessionStorage.removeItem(PROFILE_KEY);
            //     alert("Profile submitted successfully!");
            // })
            // MASHAIR FIX - fixed order: alert first then redirect
            user.updateProfile(fullname, contact_email, contact_phone, location, services, about_you, experience, hourly_rate, about_experience, skills)
                .then(() => {
                    sessionStorage.removeItem(PROFILE_KEY);
                    alert("Profile submitted successfully!");
                    window.location.href = "jobseeker-dashboard.html";
                })
                .catch(error => {
                    alert("Error submitting profile: " + error);
                });
        });
    }

    // ===== JOB OFFERS PAGE =====
    // DIEM - original only loads jobs when service button is clicked:
    // async function loadJobs() {
    //     document.querySelectorAll(".service-btn").forEach(btn => {
    //         btn.addEventListener("click", async () => {
    //             ...
    //         });
    //     });
    // };
    // MASHAIR FIX - added getAllJob() so all jobs load by default on page open
    async function loadJobs() {
        let allJobs = await job.getAllJob();
        renderjobsByService(allJobs);

        document.querySelectorAll(".service-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                document.querySelectorAll(".service-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const jobsByService = btn.dataset.filter;
                let jobpostsList = await job.getJobByService(jobsByService);
                renderjobsByService(jobpostsList);
            });
        });
    }

    if (document.getElementById("job-list")) {
        loadJobs();
    }

   // DIEM - render jobs function
    function renderjobsByService(list) {
        const container = document.getElementById("job-list");
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
    // ===== APPLY PAGE =====
    // DIEM - original code crashes on every page because no null check:
    // const selectedJob = JSON.parse(sessionStorage.getItem("selectedJob"));
    // const userData = JSON.parse(sessionStorage.getItem("user"));
    // document.querySelector(".apply-name").value = userData.fullname;  ← crashes if not on apply page
    // MASHAIR FIX - wrapped in null checks so it only runs on apply page
    const applyForm = document.querySelector(".apply-form");
    if (applyForm) {
        const selectedJob = JSON.parse(sessionStorage.getItem("selectedJob"));
        const userData = JSON.parse(sessionStorage.getItem("user"));

        if (selectedJob && userData) {
            if (userData.fullname) document.querySelector(".apply-name").value = userData.fullname;
            if (userData.email) document.querySelector(".apply-email").value = userData.email;
            if (document.querySelector(".apply-title")) document.querySelector(".apply-title").innerHTML = selectedJob.service_title;
            if (document.querySelector(".apply-schedule")) document.querySelector(".apply-schedule").innerHTML = selectedJob.service_schedule;
            if (document.querySelector(".apply-location")) document.querySelector(".apply-location").innerHTML = `
                <img src="./Assets/location_on.png" class="location-icon">
                ${selectedJob.service_location} • ${selectedJob.service_pay_rate}`;
        }

        // DIEM - submit application
        applyForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(applyForm);
            formData.append("job_id", selectedJob.id);
            formData.append("jobseeker_id", user.id);
            await application.applyJob(formData);
            window.location.href = "jobseeker-application.html";
            alert("✅ You have successfully applied!");
        });
    }
});

// ===== APPLICATION PAGE =====
// DIEM - original application page code
document.addEventListener("DOMContentLoaded", () => {
    async function loadApplications(status) {
        try {
            const data = await application.getApplications(status);
            renderApplications(data);
        } catch (err) {
            console.error(err);
        }
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            console.log("CLICKED");
            document.querySelectorAll(".filter-btn")
                .forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const status = btn.dataset.filter;
            console.log("STATUS:", status);
            loadApplications(status);
        });
    });

    // DIEM - render applications
    function renderApplications(data) {
        const container = document.getElementById("application-list");
        // MASHAIR FIX - added null check so it doesn't crash on other pages
        if (!container) return;
        container.innerHTML = "";
        data.forEach(app => {
            const div = document.createElement("div");
            div.classList.add("job-card");
            div.classList.add("application-card");
            div.innerHTML = `
                <div class="job-top">
                <h4>${app.service_title}</h4>
                <img src="./Assets/Heart@2x.png" class="heart-icon">
                </div>
                <p class="job-time">${app.service_schedule}</p>
                <p class="apply-location">
                <img src="./Assets/location_on.png" class="location-icon">
                ${app.service_location} • ${app.service_pay_rate}
                </p>
                <p class="job-desc">
                ${app.service_description}
                </p>
                <div class="job-bottom">
                <span class="status ${app.status}">${app.status}</span>
                </div>
            `;
            // toggle details
            container.appendChild(div);
        });
    }

    // MASHAIR - auto load all applications when page opens (new)
    if (document.getElementById("application-list")) {
        loadApplications("all");
    }
});
