const itemsContainer = document.getElementById("itemsContainer");
const searchBox = document.getElementById("searchBox");
const overlay = document.getElementById("overlay");
const overlayContent = document.getElementById("overlayContent");
const pagination = document.getElementById("pagination");

let items = [];
let currentPage = 1;
const itemsPerPage = 50;

fetch("data/items.json")
    .then(response => response.json())
    .then(data => {
        items = data;
        displayItems();
    });

function displayItems() {
    itemsContainer.innerHTML = "";
    pagination.innerHTML = "";
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleItems = items.slice(start, end);
    
    visibleItems.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item");

        const img = new Image();
        img.src = `https://system.ffgarena.cloud/api/iconsff?image=${item.id}.png`;
        img.onerror = () => img.src = "static/images/fallback.png";
        img.onload = () => addWatermark(img);

        div.appendChild(img);
        div.onclick = () => showDetails(item);
        itemsContainer.appendChild(div);
    });

    generatePagination();
}

function showDetails(item) {
    overlayContent.innerHTML = `
        <h2>${item.name}</h2>
        <p><strong>ID:</strong> ${item.id}</p>
        <p><strong>Icon Name:</strong> ${item.icon_name}</p>
        <p><strong>Text ID:</strong> ${item.text_id}</p>
    `;
    overlay.classList.remove("hidden");
}

overlay.onclick = () => overlay.classList.add("hidden");

searchBox.addEventListener("input", () => {
    const query = searchBox.value.toLowerCase();
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.id.toString().includes(query) ||
        item.icon_name.toLowerCase().includes(query)
    );
    items = filteredItems;
    displayItems();
});

function generatePagination() {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            displayItems();
        };
        pagination.appendChild(btn);
    }
}

// Image Watermark Function
function addWatermark(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const watermark = new Image();
    watermark.src = "static/images/watermark.png";

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        watermark.onload = () => {
            const scale = 0.3;
            const wmWidth = watermark.width * scale;
            const wmHeight = watermark.height * scale;
            ctx.drawImage(watermark, canvas.width - wmWidth - 10, canvas.height - wmHeight - 10, wmWidth, wmHeight);
            img.src = canvas.toDataURL("image/png");
        };
    };
}
