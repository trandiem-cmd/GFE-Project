const buttons = document.querySelectorAll('.frequency-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    });
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
function saveJobpostData(newData) {
    const currentData = getJobpostData(); //object
    const updated = { ...currentData, ...newData };
    localStorage.setItem(JOBPOST_KEY, JSON.stringify(updated)); //lưu vào localStorage dưới dạng chuỗi JSON
}
document.querySelector("#next3-btn1").addEventListener("click", (event) => {
    event.preventDefault()
    window.location.href = "client-profile3.html";

});