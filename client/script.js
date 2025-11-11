"use strict";

const apiUrl = "http://localhost:5000/api/giphy-proxy";
const main = document.querySelector(".results");
const form = document.querySelector(".form");
const searchInput = document.getElementById("search");

function clearPreviousResults() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

function createImages(gifs) {
    for (const gif of gifs) {
        const img = document.createElement("img");
        const gifSrc = gif.images.fixed_height.url;

        img.src = gifSrc;
        img.alt = "Gif";
        img.classList.add("results-gif");

        main.append(img);
    }
}

async function getGifs(event) {
    event.preventDefault();
    clearPreviousResults();

    const searchInputValue = searchInput.value;
    const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            searchValue: searchInputValue,
        }),
    });
    const { data } = await response.json();
    createImages(data);
    // clear search input
    searchInput.value = "";
}

form.addEventListener("submit", getGifs);
