document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("header").style.display = "block";
    document.getElementById("container").style.display = "block";

    loadImages();
});

function loadImages() {
    const grid = document.getElementById("iconGrid");
    const imageSizes = ["100x100", "200x200", "300x300"];
    
    for (let i = 1; i <= 20; i++) {
        let img = document.createElement("img");
        img.src = `assets/${imageSizes[i % 3]}/image${i}.png`;
        img.onerror = function() { this.src = "assets/fallback.png"; };
        img.classList.add("icon-card");

        img.onclick = function () {
            openModal(`Image ${i}`, `Item ${i}`, `icon${i}.png`, this.src);
        };

        grid.appendChild(img);
    }
}

function openModal(name, itemId, iconName, imgSrc) {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modalImage").src = imgSrc;
    document.getElementById("modalName").innerText = name;
    document.getElementById("modalItemId").innerText = itemId;
    document.getElementById("modalIconName").innerText = iconName;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}
