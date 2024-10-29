// Fetch and render songs
fetch('songs.json')
    .then(response => response.json())
    .then(data => renderSongs(data))
    .catch(error => console.error('Error loading JSON:', error));

function renderSongs(songs) {
    const regularContainer = document.getElementById('regular-list');
    const specialContainer = document.getElementById('special-list');

    // Separate songs into regular and $100 requests
    const regularSongs = songs.filter(song => song.price === "20");
    const specialSongs = songs.filter(song => song.price === "100");

    // Render each list with appropriate baseURL
    renderSongList(regularContainer, regularSongs, "venmo://paycharge?txn=pay&recipients=jonguo&amount=20&note=");
    renderSongList(specialContainer, specialSongs, "venmo://paycharge?txn=pay&recipients=jonguo&amount=100&note=");
}

// Helper function to render a list of songs
function renderSongList(container, songList, baseURL) {
    // Sort songList by artist names first, and then by song title
    songList.sort((a, b) => {
        if (a.artist.toLowerCase() < b.artist.toLowerCase()) return -1;
        if (a.artist.toLowerCase() > b.artist.toLowerCase()) return 1;
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });

    // Group songs by artist
    const groupedSongs = songList.reduce((acc, song) => {
        if (!acc[song.artist]) {
            acc[song.artist] = [];
        }
        acc[song.artist].push(song);
        return acc;
    }, {});

    // Sort artists alphabetically
    const sortedArtists = Object.keys(groupedSongs).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // Render each artist and their songs
    sortedArtists.forEach(artist => {
        const artistDiv = document.createElement('div');
        artistDiv.classList.add('artist');
        artistDiv.innerHTML = `<h2>${artist}</h2>`;

        // Sort songs alphabetically within each artist group
        groupedSongs[artist].sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

        groupedSongs[artist].forEach(song => {
            const encodedTitle = encodeURIComponent(song.title); // Encode the title
            const songDiv = document.createElement('div');
            songDiv.classList.add('song');
            songDiv.innerHTML = `<a href="${baseURL}${encodedTitle}" target="_blank">${song.title}</a>`;
            artistDiv.appendChild(songDiv);
        });
        container.appendChild(artistDiv);
    });
}
