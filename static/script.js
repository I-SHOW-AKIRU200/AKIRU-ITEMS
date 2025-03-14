document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const itemsPerPage = 50;
    let items = [];

    // Load JSON Data
    fetch("data/items.json")
        .then(response => response.json())
        .then(data => {
            items = data;
            renderPage(currentPage);
            setupPagination();
        })
        .catch(error => console.error("Error loading items:", error));

    function renderPage(page) {
        const container = document.getElementById("items-container");
        container.innerHTML = "";

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = items.slice(startIndex, endIndex);

        pageItems.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

            const img = document.createElement("img");
            img.src = `https://system.ffgarena.cloud/api/iconsff?image=${item.Item_ID}.png`;

            img.onerror = function () {
                console.error(`Image not found: ${img.src}`);
                img.src = "static/images/fallback.png";
            };

            const name = document.createElement("p");
            name.textContent = item.Name;

            itemDiv.appendChild(img);
            itemDiv.appendChild(name);
            itemDiv.addEventListener("click", () => showOverlay(item));
            container.appendChild(itemDiv);
        });
    }

    function setupPagination() {
        const paginationContainer = document.getElementById("pageNumbers");
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(items.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("div");
            pageBtn.textContent = i;
            pageBtn.classList.add("page-number");
            if (i === currentPage) pageBtn.classList.add("active");

            pageBtn.addEventListener("click", function () {
                currentPage = i;
                renderPage(currentPage);
                updatePagination();
            });

            paginationContainer.appendChild(pageBtn);
        }
    }

    function updatePagination() {
        document.querySelectorAll(".page-number").forEach((btn, index) => {
            btn.classList.toggle("active", index + 1 === currentPage);
        });
    }

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            updatePagination();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
            updatePagination();
        }
    });

    function showOverlay(item) {
        document.getElementById("overlay").style.display = "flex";
        document.getElementById("item-name").textContent = item.Name;
        document.getElementById("item-id").textContent = item.Item_ID;
        document.getElementById("item-icon").textContent = item.Icon_Name;
        document.getElementById("item-textid").textContent = item.TextID;
    }

    document.getElementById("close-overlay").addEventListener("click", function () {
        document.getElementById("overlay").style.display = "none";
    });
});
