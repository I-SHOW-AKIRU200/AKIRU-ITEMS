const itemsContainer = document.getElementById('items-container');
const searchBar = document.getElementById('searchBar');
const overlay = document.getElementById('overlay');
const overlayImage = document.getElementById('overlay-image');
const overlayName = document.getElementById('overlay-name');
const overlayID = document.getElementById('overlay-id');
const overlayIcon = document.getElementById('overlay-icon');
const closeOverlay = document.getElementById('close-overlay');
const pagination = document.getElementById('pagination');

let currentPage = 1;
const itemsPerPage = 50;
let itemsData = [];

// Load JSON data
fetch('data/items.json')
    .then(response => response.json())
    .then(data => {
        itemsData = data;
        displayItems();
        setupPagination();
    });

// Function to display items
function displayItems() {
    itemsContainer.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToDisplay = itemsData.slice(start, end);

    itemsToDisplay.forEach(item => {
        const img = document.createElement('img');
        img.dataset.icon = item.Icon_Name;
        img.dataset.size = 100;

        img.src = `pngs/100x100/${item.Icon_Name}.png`;
        img.onerror = () => tryNextSize(img);

        img.classList.add('item');
        img.setAttribute('data-name', item.Name);
        img.setAttribute('data-id', item.Item_ID);

        img.addEventListener('click', () => showOverlay(img));

        itemsContainer.appendChild(img);
    });
}

// Function to try the next image size (200x200 → 300x300 → fallback)
function tryNextSize(img) {
    const nextSize = parseInt(img.dataset.size) * 2;
    if (nextSize <= 300) {
        img.dataset.size = nextSize;
        img.src = `pngs/${nextSize}x${nextSize}/${img.dataset.icon}.png`;
        img.onerror = () => tryNextSize(img);
    } else {
        img.src = 'static/images/fallback.png';
    }
}

// Function to show overlay
function showOverlay(img) {
    overlay.style.display = 'flex';
    overlayImage.src = img.src;
    overlayName.textContent = img.getAttribute('data-name');
    overlayID.textContent = img.getAttribute('data-id');
    overlayIcon.textContent = img.dataset.icon;
}

// Close overlay
closeOverlay.addEventListener('click', () => {
    overlay.style.display = 'none';
});

// Setup pagination
function setupPagination() {
    pagination.innerHTML = '';

    let totalPages = Math.ceil(itemsData.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayItems();
        });
        pagination.appendChild(pageButton);
    }
}

// Search functionality
searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    itemsContainer.innerHTML = '';

    const filteredItems = itemsData.filter(item =>
        item.Name.toLowerCase().includes(query) ||
        item.Item_ID.includes(query) ||
        item.Icon_Name.toLowerCase().includes(query)
    );

    filteredItems.forEach(item => {
        const img = document.createElement('img');
        img.dataset.icon = item.Icon_Name;
        img.dataset.size = 100;

        img.src = `pngs/100x100/${item.Icon_Name}.png`;
        img.onerror = () => tryNextSize(img);

        img.classList.add('item');
        img.setAttribute('data-name', item.Name);
        img.setAttribute('data-id', item.Item_ID);

        img.addEventListener('click', () => showOverlay(img));

        itemsContainer.appendChild(img);
    });
});
