
let albums = [];
let currentPage = 1;
const itemsPerPage = 20;

async function fetchAlbums() {
const response = await fetch('albums1.json');
albums = await response.json();
renderAlbums();
}

function renderAlbums() {
const searchQuery = document.getElementById('search').value.toLowerCase();
const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery) || 
    album.artists.toLowerCase().includes(searchQuery) || 
    album.songs.some(song => song.title.toLowerCase().includes(searchQuery))
);

const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
if (totalPages === 0) {
    currentPage = 1; // Reset if no results
} else {
    currentPage = Math.min(currentPage, totalPages); // Keep within bounds
}

const start = (currentPage - 1) * itemsPerPage;
const paginatedAlbums = filteredAlbums.slice(start, start + itemsPerPage);

const container = document.getElementById('albums-container');
container.innerHTML = paginatedAlbums.map(album => `
    <div class="album">
        <img src="${album.image}" alt="${album.title}" style="width: 80px; height: 80px;">
        <div class="album-content">
            <h3>${album.title} (${album.year})</h3>
            <p>Artists: ${album.artists}</p>

            <button onclick='downloadAlbum(${JSON.stringify(album.songs)})' class="download-btn">
                <i class="fas fa-download"></i> Download Album
            </button>

            <ul>
                ${album.songs.map(song => `
                    <li>
                        ${song.title} - ${song.artists}
                        <a href="${song.downloads['320kbps']}" target="_blank" class="download-link">
                            <i class="fas fa-download"></i>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    </div>
`).join('');

document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages || 1}`;
document.getElementById('prev').disabled = currentPage === 1;
document.getElementById('next').disabled = currentPage >= totalPages;
}

function downloadAlbum(songs) {
let index = 0;

function triggerDownload() {
    if (index >= songs.length) return;

    const song = songs[index];
    const link = document.createElement('a');
    link.href = song.downloads['320kbps'];
    link.download = song.title + '.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    index++;
    setTimeout(triggerDownload, 2000);
}

triggerDownload();
}

document.getElementById('search').addEventListener('input', () => {
currentPage = 1; // Reset to first page on search
renderAlbums();
});

document.getElementById('prev').addEventListener('click', () => {
if (currentPage > 1) {
    currentPage--;
    renderAlbums();
}
});

document.getElementById('next').addEventListener('click', () => {
const searchQuery = document.getElementById('search').value.toLowerCase();
const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery) || 
    album.artists.toLowerCase().includes(searchQuery) || 
    album.songs.some(song => song.title.toLowerCase().includes(searchQuery))
);

const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);

if (currentPage < totalPages) {
    currentPage++;
    renderAlbums();
}
});

fetchAlbums();