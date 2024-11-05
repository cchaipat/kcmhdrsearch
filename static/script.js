document.addEventListener("DOMContentLoaded", function() {
    let cropper;


    // Event listener for file input to show image preview and initialize cropper
    document.getElementById('file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const image = document.getElementById('image-preview');
                image.src = event.target.result;
                image.style.display = 'block';

                // Initialize or re-initialize cropper
                if (cropper) cropper.destroy();
                cropper = new Cropper(image, {
                    aspectRatio: 1,
                    viewMode: 2,
                    autoCropArea: 1,
                    movable: true,
                    zoomable: true,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    const thaiNameInputs = [
        document.getElementById("position"),
        document.getElementById("thai_first_name"),
        document.getElementById("thai_surname")
    ];

    // Regular expression to match Thai characters
    const thaiCharPattern = /^[\u0E00-\u0E7F.]+$/;

    // Function to validate Thai name inputs
    function validateThaiName(input) {
        if (!thaiCharPattern.test(input.value)) {
            alert("Please enter only Thai characters in Thai name fields.");
            input.value = ""; // Clear the invalid input
            input.focus(); // Bring focus back to the field
        }
    }

    // Attach the validation function to the input events
    thaiNameInputs.forEach(input => {
        input.addEventListener("input", function() {
            validateThaiName(input);
        });
    });

    // Function to add a new education entry
    window.addEducation = function() {
        const educationSection = document.getElementById("education-section");
        const newEntry = document.createElement("div");
        newEntry.classList.add("education-entry");

        newEntry.innerHTML = `
            <input type="text" name="education_year[]" placeholder="Year" class="year-input">
            <input type="text" name="education_credential[]" placeholder="Credential" class="credential-input">
        `;
        educationSection.appendChild(newEntry);
    };

    // Function to add a new education entry
    window.addInterest = function() {
        const interestSection = document.getElementById("interest-section");
        const newinterestEntry = document.createElement("div");
        newinterestEntry.classList.add("interest-entry");

        newinterestEntry.innerHTML = `
            <input type="text" name="interest[]" placeholder="Interest" class="interest-input">
        `;
        interestSection.appendChild(newinterestEntry);
    };

    window.addScheduleEntry = function() {
        const scheduleEntries = document.getElementById("schedule-entry");

        const newEntry = document.createElement("div");
        newEntry.classList.add("schedule-row");

        newEntry.innerHTML = `
            <select name="schedule_day[]">
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select>

            <select name="start_time[]">
                <option value="08:00">08:00</option>
                <option value="08:30">08:30</option>
                <option value="09:00">09:00</option>
                <option value="09:00">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
                <option value="11:30">11:30</option>
                <option value="12:00">12:00</option>
                <option value="12:30">12:30</option>
                <option value="13:00">13:00</option>
                <option value="13:30">13:30</option>
                <option value="14:00">14:00</option>
                <option value="14:30">14:30</option>
                <option value="15:00">15:00</option>
                <option value="15:30">15:30</option>
                <option value="16:00">16:00</option>
                <option value="16:30">16:30</option>
                <option value="17:00">17:00</option>
                <option value="17:30">17:30</option>
                <option value="18:00">18:00</option>
                <option value="18:30">18:30</option>
                <option value="19:00">19:00</option>
                <option value="19:30">19:30</option>
                <option value="20:00">20:00</option>
                <option value="20:30">20:30</option>
            </select>

            <select name="end_time[]">
                <option value="08:30">08:30</option>
                <option value="09:00">09:00</option>
                <option value="09:00">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
                <option value="11:30">11:30</option>
                <option value="12:00">12:00</option>
                <option value="12:30">12:30</option>
                <option value="13:00">13:00</option>
                <option value="13:30">13:30</option>
                <option value="14:00">14:00</option>
                <option value="14:30">14:30</option>
                <option value="15:00">15:00</option>
                <option value="15:30">15:30</option>
                <option value="16:00">16:00</option>
                <option value="16:30">16:30</option>
                <option value="17:00">17:00</option>
                <option value="17:30">17:30</option>
                <option value="18:00">18:00</option>
                <option value="18:30">18:30</option>
                <option value="19:00">19:00</option>
                <option value="19:30">19:30</option>
                <option value="20:00">20:00</option>
                <option value="20:30">20:30</option>
                <option value="21:00">21:00</option>
                <!-- Add more time intervals as needed -->
            </select>
        `;
        // Create the location dropdown dynamically
        const locationSelect = document.createElement("select");
        locationSelect.name = "location[]";
        locations.forEach(location => {
            const option = document.createElement("option");
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });

        // Append the location dropdown to the new entry
        newEntry.appendChild(locationSelect);


        // Append the new row to the schedule entries container
        scheduleEntries.appendChild(newEntry);
    }


    // Function to handle form submission with cropped image
    window.cropAndUpload = function() {
        if (!cropper) {
            alert("Please upload and crop your image.");
            return;
        }

        // Get the cropped image as a Blob and submit it
        cropper.getCroppedCanvas({
            width: 200,
            height: 200,
        }).toBlob((blob) => {
            const formData = new FormData();
            formData.append('cropped_image', blob, 'cropped_image.jpg');

            // Collect Thai and English name fields
            formData.append('position', document.getElementById('position').value.trim());
            formData.append('thai_first_name', document.getElementById('thai_first_name').value.trim());
            formData.append('thai_surname', document.getElementById('thai_surname').value.trim());
            formData.append('english_first_name', document.getElementById('english_first_name').value.trim());
            formData.append('english_surname', document.getElementById('english_surname').value.trim());

            // Collect department and specialty
            formData.append('department', document.getElementById('department').value);
            formData.append('specialty', document.getElementById('specialty').value);  // Add specialty

            document.querySelectorAll('input[name="education_year[]"]').forEach(year => {
                formData.append('education_year[]', year.value.trim());
            });

            document.querySelectorAll('input[name="education_credential[]"]').forEach(credential => {
                formData.append('education_credential[]', credential.value.trim());
            });

            // Collect dynamic interest fields
            document.querySelectorAll('input[name="interest[]"]').forEach(interest => {
                formData.append('interest[]', interest.value.trim());
            });

            // Collect dynamic schedule fields without indexing the names

            const scheduleRows = document.querySelectorAll(".schedule-row");

            // Loop through each schedule row and get the values
            scheduleRows.forEach((row, index) => {
                // Get selected values from each dropdown in this row
                const day = row.querySelector("select[name='schedule_day[]']").value;
                const startTime = row.querySelector("select[name='start_time[]']").value;
                const endTime = row.querySelector("select[name='end_time[]']").value;
                const location = row.querySelector("select[name='location[]']").value;

                // Log or process the values
                formData.append('schedule_day[]', day.trim());
                formData.append('start_time[]', startTime.trim());
                formData.append('end_time[]', endTime.trim());
                formData.append('location[]', location.trim());
            });

            // Get the free text area value
            const additionalComments = document.getElementById('additional_comments').value.trim();
            formData.append('additional_comments', additionalComments);


            // Post the data to the server
            fetch('/upload', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.text())
            .then(result => {
                
                document.getElementById('file').value = "";  // Reset file input
                document.getElementById('image-preview').style.display = 'none';
                window.location.href = "/logout";
            })
            .catch(error => console.error('Error:', error));
        });
    };
});