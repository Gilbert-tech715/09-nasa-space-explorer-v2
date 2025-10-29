// Get the button element from the HTML
const getImageBtn = document.getElementById('getImageBtn');

// Get the gallery container where we'll display images
const gallery = document.getElementById('gallery');

// Get modal elements for popup display
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalExplanation = document.getElementById('modal-explanation');
const modalCopyright = document.getElementById('modal-copyright');
const closeButton = document.querySelector('.close-button');

// Get the loading spinner element
const loadingSpinner = document.getElementById('loading-spinner');

// Get the space fact text element
const factText = document.getElementById('fact-text');

// NASA API URL for APOD data (9 consecutive days)
const apiUrl = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Array of interesting space facts
const spaceFacts = [
  "There are more stars in the universe than grains of sand on Earth.",
  "One day on Venus is longer than one year on Venus.",
  "A year on Mercury is just 88 days long.",
  "The footprints on the Moon will be there for 100 million years.",
  "The Sun makes up 99.86% of the mass of our solar system.",
  "If you could fly to Pluto, it would take more than 800 years.",
  "A single teaspoon of a neutron star would weigh 6 billion tons.",
  "The largest known star is UY Scuti, about 1,700 times larger than our Sun.",
  "There may be more than 100 billion galaxies in the universe.",
  "Saturn's rings are made mostly of ice and rock particles.",
  "Jupiter's Great Red Spot is a storm that has been raging for over 300 years.",
  "The Milky Way galaxy will collide with Andromeda in about 4 billion years.",
  "Astronauts can grow up to 2 inches taller in space due to lack of gravity.",
  "The International Space Station orbits Earth every 90 minutes.",
  "Mars has the largest volcano in our solar system, Olympus Mons."
];

// Function to display a random space fact
function displayRandomFact() {
  // Get a random index from the spaceFacts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  
  // Get the random fact using the random index
  const randomFact = spaceFacts[randomIndex];
  
  // Display the random fact in the fact text element
  factText.textContent = randomFact;
}

// Display a random fact when the page loads
displayRandomFact();

// Add click event listener to the button
getImageBtn.addEventListener('click', fetchSpaceImages);

// Close modal when clicking the X button
closeButton.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
  // Only close if clicking the dark overlay, not the modal content
  if (event.target === modal) {
    closeModal();
  }
});

// Function to fetch space images from NASA API
async function fetchSpaceImages() {
  try {
    // Hide the placeholder and show the loading spinner
    gallery.innerHTML = '';
    loadingSpinner.style.display = 'block';
    
    // Fetch data from the API
    const response = await fetch(apiUrl);
    
    // Convert response to JSON format
    const data = await response.json();
    
    // Get the first 9 items from the data
    const nineImages = data.slice(0, 9);
    
    // Hide the loading spinner before displaying images
    loadingSpinner.style.display = 'none';
    
    // Display the images in the gallery
    displayImages(nineImages);
    
  } catch (error) {
    // Hide the loading spinner if there's an error
    loadingSpinner.style.display = 'none';
    
    // If there's an error, show error message
    gallery.innerHTML = '<p class="error">Error loading images. Please try again.</p>';
    console.error('Error fetching images:', error);
  }
}

// Function to display images in the gallery grid
function displayImages(images) {
  // Clear the gallery first (remove placeholder or loading message)
  gallery.innerHTML = '';
  
  // Loop through each image in the array
  images.forEach((image, index) => {
    // Create a new div element for each image card
    const card = document.createElement('div');
    card.className = 'image-card';
    
    // Check if this item is a video or an image
    const isVideo = image.media_type === 'video';
    
    // Build the HTML content for the card
    if (isVideo) {
      // For video entries, use thumbnail image if available
      const thumbnailUrl = image.thumbnail_url || image.url;
      
      card.innerHTML = `
        <div class="video-thumbnail-wrapper">
          <img src="${thumbnailUrl}" alt="${image.title}" class="clickable-image video-thumbnail" />
          <div class="play-icon">▶</div>
        </div>
        <div class="card-content">
          <h3>${image.title}</h3>
          <p class="date">${image.date}</p>
          <p class="description">${image.explanation}</p>
          ${image.copyright ? `<p class="copyright">© ${image.copyright}</p>` : ''}
        </div>
      `;
      
      // Add click event to open modal with video for videos
      const videoThumbnail = card.querySelector('.video-thumbnail-wrapper');
      videoThumbnail.addEventListener('click', () => {
        // Open the modal with the video embedded
        openModal(image);
      });
    } else {
      // For image entries, use a regular img tag
      card.innerHTML = `
        <img src="${image.url}" alt="${image.title}" class="clickable-image" />
        <div class="card-content">
          <h3>${image.title}</h3>
          <p class="date">${image.date}</p>
          <p class="description">${image.explanation}</p>
          ${image.copyright ? `<p class="copyright">© ${image.copyright}</p>` : ''}
        </div>
      `;
      
      // Add click event to open modal for images only
      const imageElement = card.querySelector('img');
      imageElement.addEventListener('click', () => {
        openModal(image);
      });
    }
    
    // Add the card to the gallery container
    gallery.appendChild(card);
  });
  
  // Log how many images were displayed (for debugging)
  console.log(`Displayed ${images.length} images`);
}

// Function to open the modal with image details
function openModal(image) {
  // Check if this is a video or image
  const isVideo = image.media_type === 'video';
  
  if (isVideo) {
    // For videos, replace the image with an iframe
    modalImage.style.display = 'none';
    
    // Create an iframe element for the video
    let videoIframe = document.getElementById('modal-video');
    if (!videoIframe) {
      videoIframe = document.createElement('iframe');
      videoIframe.id = 'modal-video';
      videoIframe.className = 'modal-video-frame';
      videoIframe.setAttribute('frameborder', '0');
      videoIframe.setAttribute('allowfullscreen', 'true');
      // Insert the iframe before the modal-info section
      modalImage.parentNode.insertBefore(videoIframe, modalImage);
    }
    
    // Set the video URL
    videoIframe.src = image.url;
    videoIframe.style.display = 'block';
  } else {
    // For images, show the image and hide any video iframe
    modalImage.src = image.url;
    modalImage.alt = image.title;
    modalImage.style.display = 'block';
    
    // Hide video iframe if it exists
    const videoIframe = document.getElementById('modal-video');
    if (videoIframe) {
      videoIframe.style.display = 'none';
      videoIframe.src = '';
    }
  }
  
  // Set the title, date, and explanation
  modalTitle.textContent = image.title;
  modalDate.textContent = image.date;
  modalExplanation.textContent = image.explanation;
  
  // Set copyright if it exists, otherwise hide it
  if (image.copyright) {
    modalCopyright.textContent = `© ${image.copyright}`;
    modalCopyright.style.display = 'block';
  } else {
    modalCopyright.style.display = 'none';
  }
  
  // Show the modal by adding the 'show' class
  modal.classList.add('show');
}

// Function to close the modal
function closeModal() {
  // Hide the modal by removing the 'show' class
  modal.classList.remove('show');
  
  // Stop any video that might be playing by clearing the iframe src
  const videoIframe = document.getElementById('modal-video');
  if (videoIframe) {
    videoIframe.src = '';
  }
}