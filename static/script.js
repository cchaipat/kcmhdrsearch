// static/script.js
async function searchDoctor() {
  const query = document.getElementById("doctor-name").value;
  const formData = new FormData();
  formData.append("doctor_name", query);

  const response = await fetch('/search', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  const profileDisplay = document.getElementById("profile-display");
  const scheduleTable = document.getElementById("schedule-table").querySelector("tbody");
  scheduleTable.innerHTML = '';  // Clear previous schedule

  if (data.doctor) {
    profileDisplay.style.display = 'block';
    document.getElementById("doctor-photo").src = `/images/${data.doctor.photo}`;
    document.getElementById("doctor-name-display").innerText = data.doctor.name;
    document.getElementById("doctor-specialty").innerText = data.doctor.specialty;
    document.getElementById("doctor-education").innerText = `Education: ${data.doctor.education}`;
    document.getElementById("doctor-experience").innerText = `Experience: ${data.doctor.experience}`;

    // Populate schedule table
    data.schedule.forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${entry.day}</td><td>${entry.time}</td>`;
      scheduleTable.appendChild(row);
    });
  } else {
    profileDisplay.style.display = 'none';
    alert('Doctor not found');
  }
}