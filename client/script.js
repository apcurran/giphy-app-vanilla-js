"use strict";

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
        const vid = document.createElement("video");
        const { alt_text } = gif;
        const gifSrc = gif.images.fixed_height.mp4;
        const width = gif.images.fixed_height.width;
        const height = gif.images.fixed_height.height;

        vid.src = gifSrc;
        vid.ariaLabel = alt_text;
        vid.width = width;
        vid.height = height;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.classList.add("results-gif");

        main.append(vid);
    }
}

async function getGifs(event) {
    event.preventDefault();
    clearPreviousResults();

    const apiUrl = "http://localhost:5000/api/giphy-proxy";
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
