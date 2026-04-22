import { User } from "../class/User.js";
import { BACKEND_URL } from '../config.js';
const user = new User();

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  initLocationDropdown();

  // MASHAIR - eye icon toggle for password fields (same as jobseeker profile)
  document.querySelectorAll('.toggle-pw').forEach(span => {
    span.addEventListener('click', function() {
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
});

// ================= LOAD PROFILE =================
async function loadProfile() {
  try {
    if (!user.isLoggedIn) {
      window.location.href = "login.html";
      return;
    }

    const res = await fetch(`${BACKEND_URL}/profile/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    const data = await res.json();
    renderProfile(data);

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// ================= RENDER PROFILE =================
function renderProfile(userData) {
  const header = document.getElementById("header-name");
  if (header) header.textContent = userData.fullname || "";

  document.getElementById("name-display").textContent = userData.fullname || "";
  document.getElementById("phone-display").textContent = userData.contact_phone || "";
  document.getElementById("email-display").textContent = userData.contact_email || "";
  document.getElementById("location-display").textContent = userData.location || "";

  document.getElementById("name-input").value = userData.fullname || "";
  document.getElementById("phone-input").value = userData.contact_phone || "";
  document.getElementById("email-input").value = userData.contact_email || "";
  document.getElementById("location-input").value = userData.location || "";

  if (userData.location) {
    const [savedCity, savedDistrict] = userData.location.split(" - ");
    const city = document.getElementById("edit-city");
    const district = document.getElementById("edit-district");
    if (city && district) {
      city.value = savedCity;
      city.dispatchEvent(new Event("change"));
      setTimeout(() => {
        district.value = savedDistrict;
      }, 100);
    }
  }
}

// ================= EDIT BUTTON =================
document.getElementById("editBtn").addEventListener("click", () => {
  toggleEdit(true);
});

// ================= SAVE BUTTON =================
document.getElementById("saveBtn").addEventListener("click", async () => {
  try {
    const body = {
      fullname: document.getElementById("name-input").value,
      contact_email: document.getElementById("email-input").value,
      contact_phone: document.getElementById("phone-input").value,
      location: document.getElementById("location-input").value,
    };

    await fetch(`${BACKEND_URL}/profile/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(body)
    });

    // ================= PASSWORD UPDATE =================
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (currentPassword || newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await fetch(`${BACKEND_URL}/profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }
    }

    alert("Profile updated successfully!");
    loadProfile();
    toggleEdit(false);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
  }
});

// ================= CANCEL BUTTON =================
document.getElementById("cancelBtn").addEventListener("click", () => {
  toggleEdit(false);
});

// ================= TOGGLE EDIT MODE =================
function toggleEdit(isEdit) {
  const fields = ["name", "phone", "email", "location", "password"];

  fields.forEach(f => {
    const display = document.getElementById(`${f}-display`);
    let input;

    if (f === "location") {
      input = document.getElementById("location-input-wrapper");
    } else if (f === "password") {
      input = document.getElementById("password-input-wrapper");
    } else {
      input = document.getElementById(`${f}-input`);
    }

    if (display && input) {
      display.classList.toggle("d-none", isEdit);
      input.classList.toggle("d-none", !isEdit);
    }
  });

  document.getElementById("editBtn").classList.toggle("d-none", isEdit);
  document.getElementById("saveBtn").classList.toggle("d-none", !isEdit);
  document.getElementById("cancelBtn").style.display = isEdit ? "inline-block" : "none";
}

// ================= LOCATION DROPDOWN =================
function initLocationDropdown() {
  const city = document.getElementById("edit-city");
  const district = document.getElementById("edit-district");
  const locationInput = document.getElementById("location-input");

  if (!city || !district || !locationInput) return;

  const data = {
    Helsinki: ["Keskusta","Kallio","Pasila","Itäkeskus","Kamppi"],
    Espoo: ["Tapiola","Leppävaara","Otaniemi","Matinkylä"],
    Vantaa: ["Tikkurila","Myyrmäki","Korso","Hakunila"],
    Tampere: ["Keskusta","Hervanta","Tammela","Kaleva"],
    Turku: ["Keskusta","Varissuo","Runosmäki","Skanssi"],
    Oulu: ["Keskusta","Kaakkuri","Linnanmaa","Tuira"]
  };

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
      locationInput.value = `${city.value} - ${district.value}`;
    }
  });

  // ================= DELETE ACCOUNT =================
  document.getElementById("deleteBtn").addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      await fetch(`${BACKEND_URL}/profile/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      alert("Account deleted successfully");
      user.logout();
      window.location.href = "index.html";

    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  });
}