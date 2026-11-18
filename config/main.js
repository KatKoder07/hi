// This changes the title of your site

var sitename = "unblocked ski"; // Change this to change the name of your website.
var subtext = "v1"; // set the subtext

// more settings in main.css



// END CONFIG
// DO NOT MODIFY IF YOU DO NOT KNOW WHAT YOUR DOING!

import "./custom.js";

const serverUrl = "https://gms.parcoil.com";
document.title = `${sitename} | Native Arcade`;
let gamesData = [];

function displayFilteredGames(filteredGames) {
  const gamesContainer = document.getElementById("gamesContainer");
  const searchStatus = document.getElementById("searchStatus");
  const searchValue = document.getElementById("searchInput").value.trim();
  gamesContainer.replaceChildren();

  if (searchValue) {
    searchStatus.textContent = `${filteredGames.length} ${
      filteredGames.length === 1 ? "game" : "games"
    } found for “${searchValue}”`;
  } else {
    searchStatus.textContent = "Browse the collection";
  }

  if (filteredGames.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "grid-message";
    const heading = document.createElement("strong");
    heading.textContent = searchValue ? "No games found" : "No games to show";
    const message = document.createElement("span");
    message.textContent = searchValue
      ? "Try another title or clear your search."
      : "The game collection is currently empty.";
    emptyState.append(heading, message);
    gamesContainer.appendChild(emptyState);
    return;
  }

  filteredGames.forEach((game) => {
    const gameLink = document.createElement("a");
    gameLink.className = "game";
    gameLink.setAttribute("aria-label", `Play ${game.name}`);
    const gameParams = new URLSearchParams({
      gameurl: `${game.url.trim()}/`,
      gamename: game.name,
    });
    gameLink.href = `play.html?${gameParams.toString()}`;

    const imageWrap = document.createElement("div");
    imageWrap.className = "game-image-wrap";
    const gameImage = document.createElement("img");
    gameImage.src = `${serverUrl}/${game.url}/${game.image}`;
    gameImage.alt = "";
    gameImage.loading = "lazy";
    gameImage.decoding = "async";
    gameImage.addEventListener("error", () => {
      imageWrap.classList.add("image-unavailable");
      gameImage.remove();
    }, { once: true });
    imageWrap.appendChild(gameImage);

    if (game.new) {
      const badge = document.createElement("span");
      badge.className = "game-badge";
      badge.textContent = "New";
      imageWrap.appendChild(badge);
    }

    const gameInfo = document.createElement("div");
    gameInfo.className = "game-info";
    const gameName = document.createElement("p");
    gameName.textContent = game.name;
    const arrow = document.createElement("span");
    arrow.className = "game-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    gameInfo.append(gameName, arrow);

    gameLink.append(imageWrap, gameInfo);
    gamesContainer.appendChild(gameLink);
  });
}

function handleSearchInput() {
  const searchInput = document.getElementById("searchInput");
  const searchInputValue = searchInput.value.trim().toLowerCase();
  document.getElementById("clearSearch").hidden = searchInputValue.length === 0;
  const filteredGames = gamesData.filter((game) =>
    game.name.toLowerCase().includes(searchInputValue)
  );
  displayFilteredGames(filteredGames);
}

fetch("./config/games.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load the game list (${response.status}).`);
    }
    return response.json();
  })
  .then((data) => {
    if (!Array.isArray(data)) {
      throw new TypeError("The game list must be an array.");
    }
    gamesData = data;
    document.getElementById("gameCount").textContent = `${data.length} ${
      data.length === 1 ? "game" : "games"
    } to explore`;
    displayFilteredGames(data);
  })
  .catch((error) => {
    console.error("Error fetching games:", error);
    document.getElementById("gameCount").textContent = "The collection is unavailable";
    const gamesContainer = document.getElementById("gamesContainer");
    gamesContainer.replaceChildren();
    const errorMessage = document.createElement("p");
    errorMessage.className = "grid-message";
    errorMessage.textContent = "We couldn't load the games. Please try again later.";
    gamesContainer.appendChild(errorMessage);
  });


document
  .getElementById("searchInput")
  .addEventListener("input", handleSearchInput);

document.getElementById("clearSearch").addEventListener("click", () => {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  handleSearchInput();
  searchInput.focus();
});

document.getElementById("title").textContent = sitename;
document.getElementById("brandName").firstChild.textContent = sitename;
document.getElementById("subtitle").textContent = subtext;

