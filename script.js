const map = L.map('map').setView([-8.5, 140.4], 9);

// Tambahkan tile basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Objek untuk menyimpan marker per tempat wisata
const markers = {};

// Fungsi untuk menampilkan semua marker
function showMarkers(data) {
  // Hapus semua marker lama
  Object.values(markers).forEach(marker => map.removeLayer(marker));
  for (let key in markers) delete markers[key];

  // Tambahkan marker baru dari data
  data.forEach(wisata => {
    const popupContent = `
      <strong>${wisata.nama}</strong><br/>
      <em>${wisata.kategori}</em><br/>
      ${wisata.deskripsi}<br/>
      <small>${wisata.keterangan}</small><br/>
      <img src="${wisata.gambar}" alt="${wisata.nama}" width="250"/>
    `;

    const marker = L.marker([wisata.lat, wisata.lng]).addTo(map);
    marker.bindPopup(popupContent);

    // Simpan marker agar bisa dibuka dari daftar
    markers[wisata.nama] = marker;
  });
}

// Fungsi untuk menampilkan daftar wisata di sidebar
function showList(data) {
  const listEl = document.getElementById('placeList');
  listEl.innerHTML = '';

  if (data.length === 0) {
    listEl.innerHTML = '<p>Tidak ditemukan.</p>';
    return;
  }

  data.forEach(wisata => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <strong>${wisata.nama}</strong><br/>
      <em>${wisata.kategori}</em><br/>
      <small>${wisata.deskripsi}</small>
    `;
    item.onclick = () => {
      map.setView([wisata.lat, wisata.lng], 13);
      if (markers[wisata.nama]) {
        markers[wisata.nama].openPopup(); // Buka popup marker saat diklik
      }
    };
    listEl.appendChild(item);
  });
}

// Fungsi filter berdasarkan input & kategori
function filterData() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categorySelect').value;

  const filtered = wisataData.filter(wisata => {
    const matchName = wisata.nama.toLowerCase().includes(keyword);
    const matchCategory = category === 'all' || wisata.kategori === category;
    return matchName && matchCategory;
  });

  showMarkers(filtered);
  showList(filtered);
}

// Event listener
document.getElementById('searchInput').addEventListener('input', filterData);
document.getElementById('categorySelect').addEventListener('change', filterData);

// Pertama kali tampilkan semua
showMarkers(wisataData);
showList(wisataData);
