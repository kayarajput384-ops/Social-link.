// Wallpaper data (you can add more)
const wallpapers = [
  { url: "https://picsum.photos/id/1015/600/400", category: "nature" },
  { url: "https://picsum.photos/id/1025/600/400", category: "nature" },
  { url: "https://picsum.photos/id/1005/600/400", category: "movies" },
  { url: "https://picsum.photos/id/1043/600/400", category: "gaming" },
  { url: "https://picsum.photos/id/1041/600/400", category: "gaming" },
  { url: "https://picsum.photos/id/1052/600/400", category: "movies" }
];

const grid = document.getElementById("wallGrid");
function displayWallpapers(filter = "all") {
  grid.innerHTML = "";
  wallpapers
    .filter(w => filter === "all" || w.category === filter)
    .forEach(w => {
      const img = document.createElement("img");
      img.src = w.url;
      grid.appendChild(img);
    });
}
displayWallpapers();

function filterCategory(cat) {
  displayWallpapers(cat);
}

// Search function
document.getElementById("searchBar").addEventListener("keyup", e => {
  const term = e.target.value.toLowerCase();
  grid.querySelectorAll("img").forEach(img => {
    img.style.display = img.src.toLowerCase().includes(term) ? "block" : "none";
  });
});
