"use strict";

const main = document.querySelector(".results");
const searchInput = document.getElementById("search");
const form = document.querySelector(".form");

form.addEventListener("submit", handleSubmit);

/**
 * @param {Event} event - form submission event obj
 */
async function handleSubmit(event) {
    event.preventDefault();

    const searchInputValue = searchInput.value.trim();

    if (!searchInputValue) {
        return;
    }

    try {
        const gifs = await fetchGifs(searchInputValue);
        const videos = gifs.map(transformApiDataToVideoData);
        renderVideos(videos);
    } catch (err) {
        console.error(err);
    }

    searchInput.value = "";
}

/**
 * @param {string} searchValue
 * @returns {array}
 */
async function fetchGifs(searchValue) {
    const apiUrl = "http://localhost:5000/api/giphy-proxy";
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            searchValue,
        }),
    });

    if (!response.ok) {
        throw new Error(`Gif fetch failed: ${response.status}`);
    }

    const { data } = await response.json();

    return data;
}

/**
 * @param {object} gifData
 * @returns {object}
 */
function transformApiDataToVideoData(gifData) {
    const { alt_text } = gifData;
    const { mp4: src, width, height } = gifData.images.fixed_height;

    return {
        src,
        width,
        height,
        alt_text,
    };
}

/**
 * @param {object[]} videosData
 * @returns {void} - side effect of adding video DOM elems to main elem
 */
function renderVideos(videosData) {
    // create all video elems in memory
    let fragment = document.createDocumentFragment();

    for (let { src, width, height, alt_text } of videosData) {
        let vid = document.createElement("video");
        vid.src = src;
        vid.width = width;
        vid.height = height;
        vid.ariaLabel = alt_text;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.classList.add("results-gif");

        fragment.append(vid);
    }

    // batch update to DOM
    main.replaceChildren(fragment);
}
