// Dummy data for demonstration
const placesData = [
    { name: "Place 1", thumbnail: "./thumbnails/place1.jpg" },
    { name: "Place 2", thumbnail: "./thumbnails/place2.jpg" },
    { name: "Place 3", thumbnail: "./thumbnails/place3.jpg" },
    // Add more places data as needed
];

// Function to create a new place card
function createPlaceCard(place) {
    const card = document.createElement("div");
    card.classList.add("place-card");

    const thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnail.src = place.thumbnail;
    thumbnail.alt = place.name;

    const name = document.createElement("p");
    name.classList.add("name");
    name.textContent = place.name;

    card.appendChild(thumbnail);
    card.appendChild(name);

    // Add click event listener to redirect to single place page
    card.addEventListener("click", () => {
        window.location.href = `single-place-page.html?name=${encodeURIComponent(place.name)}`;
    });

    return card;
}

// Function to initialize the places page
function initPlacesPage() {
    const placesContainer = document.querySelector(".places-container");
    placesData.forEach(place => {
        const card = createPlaceCard(place);
        placesContainer.appendChild(card);
    });
}

// Call the function to initialize the places page
initPlacesPage();
