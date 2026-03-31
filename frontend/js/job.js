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

  