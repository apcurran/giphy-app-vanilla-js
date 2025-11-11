"use strict";

const main = document.querySelector(".results");
const searchInput = document.getElementById("search");
const form = document.querySelector(".form");

form.addEventListener("submit", getGifs);

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

function clearPreviousResults() {
    main.replaceChildren();
}

function createImages(gifs) {
    for (const gif of gifs) {
        const vid = document.createElement("video");
        const { alt_text } = gif;
        const { mp4, width, height } = gif.images.fixed_height;

        vid.src = mp4;
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
