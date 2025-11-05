// URL for fetching NASA APOD JSON data
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Array of space facts for the "Did You Know?" feature
const spaceFacts = [
    "A day on Venus is longer than its year!",
    "The footprints on the Moon will last for 100 million years.",
    "The Sun makes up 99.86% of our solar system's mass.",
    "One million Earths could fit inside the Sun.",
    "A year on Mercury is only 88 Earth days.",
];

// Get DOM elements
const gallery = document.getElementById('gallery');
const getImageBtn = document.getElementById('getImageBtn');

// Function to show loading state
function showLoading() {
    gallery.innerHTML = `
        <div class="placeholder">
            <div class="placeholder-icon">🔄</div>
            <p>Loading space photos...</p>
        </div>
    `;
}

// Function to create HTML for gallery items
function createGalleryItem(item) {
    const date = new Date(item.date).toLocaleDateString();
    let mediaContent;

    if (item.media_type === 'video') {
        // Handle video content
        mediaContent = `<img src="${item.thumbnail_url}" alt="${item.title}" data-video-url="${item.url}">`;
    } else {
        // Handle image content
        mediaContent = `<img src="${item.url}" alt="${item.title}" data-hdurl="${item.hdurl || item.url}">`;
    }

    return `
        <div class="gallery-item" data-type="${item.media_type}">
            ${mediaContent}
            <p>${item.title}</p>
            <p>${date}</p>
        </div>
    `;
}

// Function to create and show modal
function showModal(item) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let mediaContent;
    if (item.media_type === 'video') {
        mediaContent = `
            <iframe width="100%" height="400" 
                src="${item.url}" 
                frameborder="0" 
                allowfullscreen>
            </iframe>`;
    } else {
        mediaContent = `<img src="${item.hdurl || item.url}" alt="${item.title}">`;
    }

    const date = new Date(item.date).toLocaleDateString();
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${mediaContent}
            <h2>${item.title}</h2>
            <p class="date">${date}</p>
            <p class="explanation">${item.explanation}</p>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking the close button or outside the modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Function to display random space fact
function displayRandomSpaceFact() {
    const factIndex = Math.floor(Math.random() * spaceFacts.length);
    const factDiv = document.createElement('div');
    factDiv.className = 'space-fact';
    factDiv.innerHTML = `
        <p><strong>Did You Know?</strong> ${spaceFacts[factIndex]}</p>
    `;
    
    // Insert fact before the gallery
    const galleryElement = document.getElementById('gallery');
    galleryElement.parentNode.insertBefore(factDiv, galleryElement);
}

// Function to fetch and display images
async function fetchSpaceImages() {
    try {
        showLoading();
        const response = await fetch(apodData);
        const data = await response.json();

        // Add artificial delay to show loading state (1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Clear gallery and add items
        gallery.innerHTML = '';
        data.forEach(item => {
            gallery.insertAdjacentHTML('beforeend', createGalleryItem(item));
        });

        // Add click listeners to gallery items
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => showModal(data[index]));
        });

    } catch (error) {
        gallery.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">❌</div>
                <p>Error loading images. Please try again.</p>
            </div>
        `;
        console.error('Error:', error);
    }
}

// Event Listeners
getImageBtn.addEventListener('click', fetchSpaceImages);

// Display random space fact on page load
displayRandomSpaceFact();