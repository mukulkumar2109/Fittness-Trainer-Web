let selectedFile = null;
const results = document.getElementById('results');

function previewVideo(event) {
    const file = event.target.files[0];
    const videoPreview = document.getElementById('videoPreview');
    const uploadButton = document.getElementById('uploadButton');

    if (file && file.type.startsWith('video/')) {
        selectedFile = file;
        const fileURL = URL.createObjectURL(file);
        videoPreview.src = fileURL;
        videoPreview.style.display = 'block';
        uploadButton.disabled = false; 
    } else {
        alert("Please upload a valid video file.");
        videoPreview.style.display = 'none';
        uploadButton.disabled = true; 
    }
}

async function uploadVideo() {
    if (!selectedFile) {
        alert("No video file selected.");
        return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);

    const exerciseInput = document.getElementById('exerciseInput');
    const bodyPartInput = document.getElementById('bodyPartInput');
    const exercise = exerciseInput.value.trim() || 'bicep curls';
    const bodyPart = bodyPartInput.value.trim() || 'left arm';

    formData.append('exercise', exercise);
    formData.append('body_part', bodyPart);

    try {
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]')?.value;

        const response = await fetch('http://127.0.0.1:8000/', {
            method: 'POST',
            headers: {
                ...(csrfToken && { 'X-CSRFToken': csrfToken }), // Include CSRF token if available
            },
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Assuming the response contains 'reps' in the data object, display only that.
            
            const reps = data.result ? data.result.reps : 'Reps not available';

            // Display only the reps value in the pre tag
            results.textContent = `Reps: ${reps}`;
            

            alert('Video uploaded successfully!');
        } else {
            const errorText = await response.text();
            results.textContent = `Error: ${errorText}`;
            console.error('Error:', errorText);
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        results.textContent = `Error: ${error.message}`;
    }
}
