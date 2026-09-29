**Implementation plan versi final** berdasarkan keputusan yang sudah dibahas: **React.js + Tailwind CSS + Node.js/Fastify + FFmpeg**, tanpa login dan tanpa database untuk MVP.

# Implementation Plan — YouTube Music Downloader

## 0. Scope Produk

### Target

Web app pribadi untuk mencari dan memproses audio dari sumber YouTube yang pengguna **berhak/diizinkan untuk unduh**.

### Input

Ada 2 cara:

```text
1. Search
   ↓
   ketik judul / artis / keyword

2. Paste URL
   ↓
   masukkan URL YouTube
```

### Output

```text
MP3
├── 128 kbps
├── 192 kbps
├── 256 kbps
└── 320 kbps
```

Metadata yang tersedia ikut dimasukkan jika memungkinkan:

```text
Title
Artist / Channel
Album
Album Artist
Genre
Year
Artwork
```

### Tidak ada di MVP

* Login
* Register
* User management
* Database user
* Download history
* Playlist
* Cloud storage
* Payment
* Subscription
* Mobile app

---

# 1. Arsitektur

```text
┌──────────────────────────────────────────┐
│                 REACT                    │
│              Tailwind CSS               │
│                                          │
│  Search ──┐                              │
│           ├──→ Result → Preview          │
│  URL ─────┘                 ↓            │
│                         Download         │
└────────────────────────────┬─────────────┘
                             │ HTTP
                             ↓
┌──────────────────────────────────────────┐
│             NODE.JS + FASTIFY            │
│                                          │
│  Search API                              │
│  Media API                               │
│  Download API                            │
│                                          │
│          ↓                               │
│     Processing Service                   │
│          ↓                               │
│        FFmpeg                            │
│          ↓                               │
│      MP3 + Metadata                      │
└────────────────────────────┬─────────────┘
                             │
                             ↓
                       Browser Download
                             │
                             ↓
                       Local Device
```

**Catatan:** komponen source/search harus menggunakan metode yang diizinkan dan tidak dirancang untuk melewati DRM atau pembatasan akses.

---

# 2. Struktur Project

```text
youtube-music-downloader/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── UrlInput.jsx
│   │   │   ├── SearchResultCard.jsx
│   │   │   ├── MediaPreview.jsx
│   │   │   ├── FormatSelector.jsx
│   │   │   ├── BitrateSelector.jsx
│   │   │   ├── DownloadButton.jsx
│   │   │   ├── DownloadProgress.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorMessage.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSearch.js
│   │   │   └── useDownload.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatDuration.js
│   │   │   └── formatFileName.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── search.js
│   │   │   ├── media.js
│   │   │   └── download.js
│   │   │
│   │   ├── services/
│   │   │   ├── searchService.js
│   │   │   ├── mediaService.js
│   │   │   ├── audioService.js
│   │   │   └── metadataService.js
│   │   │
│   │   ├── jobs/
│   │   │   └── downloadJob.js
│   │   │
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   ├── filename.js
│   │   │   └── cleanup.js
│   │   │
│   │   ├── config/
│   │   │   └── env.js
│   │   │
│   │   └── server.js
│   │
│   ├── temp/
│   │   └── .gitkeep
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 3. Phase 1 — Setup Frontend

## 3.1 Buat React Project

Gunakan Vite:

```bash
npm create vite@latest frontend
```

Pilih:

```text
React
JavaScript
```

Kemudian:

```bash
cd frontend
npm install
```

---

## 3.2 Install Tailwind

Pasang Tailwind sesuai setup Tailwind versi yang digunakan.

Tujuan tahap ini hanya memastikan:

```text
React
   +
Tailwind
```

sudah berjalan.

### Acceptance Criteria

Halaman React berhasil tampil dan class Tailwind bekerja.

---

# 4. Phase 2 — Buat UI Dasar

Jangan hubungkan backend dulu.

Buat:

```text
Home.jsx
```

dengan layout:

```text
┌─────────────────────────────────────────────┐
│ 🎵 Music Downloader                         │
│                                             │
│ Search                                      │
│ ┌─────────────────────────────────────────┐ │
│ │ Search title / artist...          🔍   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ OR                                          │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Paste YouTube URL                      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Search Results                              │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Thumbnail  Song Title                   │ │
│ │            Channel                     │ │
│ │            04:32                Select │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

# 5. Phase 3 — Component UI

Buat satu per satu.

## 5.1 `SearchBar.jsx`

Tugas:

```text
Input keyword
+
Search button
```

State:

```text
query
```

---

## 5.2 `UrlInput.jsx`

Tugas:

```text
Input URL
+
Process button
```

---

## 5.3 `SearchResultCard.jsx`

Menampilkan:

```text
Thumbnail
Title
Channel
Duration
Select button
```

---

## 5.4 `MediaPreview.jsx`

Setelah result dipilih:

```text
Thumbnail
Title
Artist / Channel
Album
Duration
Source
```

---

## 5.5 `BitrateSelector.jsx`

Pilihan:

```text
128 kbps
192 kbps
256 kbps
320 kbps
```

Default:

```text
192 kbps
```

---

## 5.6 `FormatSelector.jsx`

MVP:

```text
MP3
```

Karena format lain belum diperlukan.

---

## 5.7 `DownloadButton.jsx`

```text
[ Download MP3 ]
```

Ketika processing:

```text
[ Processing... ]
```

---

## 5.8 `DownloadProgress.jsx`

State:

```text
Preparing
Processing
Converting
Completed
Failed
```

Progress hanya ditampilkan jika backend mempunyai progress nyata.

---

# 6. Phase 4 — Dummy Data

Sebelum membuat backend, gunakan data palsu.

Contoh:

```js
const results = [
  {
    id: "1",
    title: "Example Song",
    channel: "Example Artist",
    duration: 245,
    thumbnail: "/example.jpg"
  }
];
```

Tujuannya memastikan:

```text
Search
 ↓
Results
 ↓
Select
 ↓
Preview
 ↓
Bitrate
 ↓
Download UI
```

sudah berjalan.

### Acceptance Criteria

User dapat menyelesaikan seluruh alur UI walaupun belum ada file sebenarnya.

---

# 7. Phase 5 — Setup Backend

Buat:

```text
backend/
```

Kemudian:

```bash
npm init -y
```

Install:

```text
Node.js
Fastify
CORS
dotenv
```

Backend menjalankan server API.

Contoh:

```text
http://localhost:3000
```

Frontend:

```text
http://localhost:5173
```

---

# 8. Phase 6 — Search API

Buat:

```text
backend/src/routes/search.js
```

Endpoint:

```http
GET /api/search?q=keyword
```

Flow:

```text
React
 ↓
GET /api/search
 ↓
search.js
 ↓
searchService.js
 ↓
approved/authorized search provider
 ↓
normalize result
 ↓
React
```

Response:

```json
{
  "results": [
    {
      "id": "...",
      "title": "...",
      "channel": "...",
      "thumbnail": "...",
      "duration": 240,
      "url": "..."
    }
  ]
}
```

### Acceptance Criteria

* Search keyword berhasil.
* Loading muncul.
* Hasil tampil.
* Empty result ditangani.
* API error ditangani.

---

# 9. Phase 7 — Hubungkan Search React

Buat:

```text
services/api.js
hooks/useSearch.js
```

Flow React:

```text
SearchBar
   ↓
useSearch()
   ↓
api.js
   ↓
GET /api/search
   ↓
Backend
   ↓
results
   ↓
SearchResultCard
```

Dengan begitu `SearchBar` tidak perlu mengetahui detail backend.

---

# 10. Phase 8 — Paste URL

Buat endpoint:

```http
POST /api/media
```

Request:

```json
{
  "url": "https://..."
}
```

Backend:

```text
URL
 ↓
validation
 ↓
mediaService
 ↓
metadata
 ↓
response
```

Response:

```json
{
  "id": "...",
  "title": "...",
  "artist": "...",
  "album": "...",
  "thumbnail": "...",
  "duration": 240,
  "sourceUrl": "..."
}
```

---

# 11. Phase 9 — Media Preview

Search dan URL harus menghasilkan objek media dengan struktur yang sama.

Artinya:

```text
Search
   ↓
Media Object
```

dan:

```text
URL
   ↓
Media Object
```

keduanya masuk ke:

```text
MediaPreview
```

Ini membuat frontend jauh lebih sederhana.

---

# 12. Phase 10 — Download API

Endpoint:

```http
POST /api/download
```

Request:

```json
{
  "mediaId": "...",
  "format": "mp3",
  "bitrate": 192
}
```

Backend membuat:

```text
Download Job
```

Response:

```json
{
  "jobId": "abc123"
}
```

---

# 13. Phase 11 — Download Job

Struktur:

```text
pending
   ↓
processing
   ↓
converting
   ↓
completed
```

atau:

```text
processing
   ↓
failed
```

Job harus mempunyai:

```text
jobId
status
progress
filename
error
createdAt
completedAt
```

Tidak perlu database.

Untuk MVP, job dapat disimpan sementara di memory backend.

---

# 14. Phase 12 — Audio Processing

Gunakan **FFmpeg** sebagai audio processing layer.

Flow:

```text
Authorized source
       ↓
Temporary input
       ↓
FFmpeg
       ↓
MP3
       ↓
Selected bitrate
       ↓
Metadata
       ↓
Output.mp3
```

Bitrate:

```text
128
192
256
320
```

---

# 15. Phase 13 — Metadata

Sebelum output final:

```text
Title
Artist
Album
Album Artist
Genre
Year
Artwork
```

dimasukkan jika tersedia.

Jangan mengarang informasi yang tidak tersedia dari source.

Jika hanya ada:

```text
Title
Channel
Thumbnail
```

maka hanya data tersebut yang digunakan.

---

# 16. Phase 14 — Progress API

Buat:

```http
GET /api/download/:jobId
```

Response:

```json
{
  "jobId": "abc123",
  "status": "processing",
  "progress": 65
}
```

Frontend melakukan polling:

```text
POST /download
      ↓
jobId
      ↓
GET status
      ↓
65%
      ↓
GET status
      ↓
100%
```

Untuk MVP, **polling** lebih sederhana daripada WebSocket.

---

# 17. Phase 15 — File Download

Ketika:

```text
status = completed
```

Frontend menampilkan:

```text
Download completed

[ Download MP3 ]
```

Endpoint:

```http
GET /api/download/:jobId/file
```

Flow:

```text
Backend
 ↓
MP3
 ↓
HTTP response
 ↓
Browser
 ↓
Downloads folder
```

---

# 18. Phase 16 — Filename

Default:

```text
Artist - Title.mp3
```

Jika artist tidak tersedia:

```text
Title.mp3
```

Filename harus disanitasi agar tidak mengandung karakter filesystem yang bermasalah.

---

# 19. Phase 17 — Cleanup

Karena tidak membutuhkan history:

```text
Temporary File
      ↓
User berhasil download
      ↓
Delete temporary file
```

Tambahkan juga cleanup otomatis jika:

```text
job timeout
job failed
user meninggalkan proses
```

Tujuannya agar storage server tidak penuh.

---

# 20. Phase 18 — Error Handling

Frontend harus memiliki pesan untuk:

```text
Invalid URL
No result
Content unavailable
Unsupported content
Processing failed
Conversion failed
Timeout
File generation failed
Server error
```

Contoh:

```text
❌ Gagal memproses audio.

[Try Again]
```

Jangan membiarkan UI berhenti di:

```text
Loading...
```

selamanya.

---

# 21. Phase 19 — Security

Walaupun aplikasi pribadi, bagian ini tetap wajib.

### URL validation

Hanya proses source/domain yang memang didukung.

### Process timeout

FFmpeg tidak boleh berjalan tanpa batas.

### File size limit

Batasi ukuran input/output.

### Rate limit

Batasi request yang terlalu banyak.

### Command injection protection

Jangan memasukkan input user langsung ke shell command.

### Temporary file cleanup

File sementara harus dihapus.

### Environment variables

API key/config sensitif:

```text
.env
```

dan jangan dimasukkan ke Git.

---

# 22. Phase 20 — Testing

## Search

```text
✓ Search normal
✓ Search kosong
✓ Search tidak menemukan hasil
✓ Search API error
```

## URL

```text
✓ URL valid
✓ URL kosong
✓ URL invalid
✓ URL unsupported
```

## Media

```text
✓ Select result
✓ Preview tampil
✓ Thumbnail tampil
✓ Metadata tampil
```

## Audio

```text
✓ MP3
✓ 128 kbps
✓ 192 kbps
✓ 256 kbps
✓ 320 kbps
```

## Processing

```text
✓ Processing
✓ Progress
✓ Completed
✓ Failed
✓ Timeout
```

## File

```text
✓ File berhasil dibuat
✓ File dapat diputar
✓ Filename benar
✓ Metadata benar
✓ File berhasil didownload
✓ Temporary file terhapus
```

---

# 23. Definition of Done

Project dianggap **selesai MVP** apabila alur berikut berhasil:

```text
                    START
                      │
                      ↓
              ┌───────────────┐
              │ Search / URL  │
              └───────┬───────┘
                      ↓
               ┌────────────┐
               │   Result   │
               └─────┬──────┘
                     ↓
              ┌──────────────┐
              │    Select    │
              └──────┬───────┘
                     ↓
             ┌─────────────────┐
             │ Media Preview   │
             └────────┬────────┘
                      ↓
             ┌─────────────────┐
             │ Format: MP3     │
             │ Bitrate: 192    │
             └────────┬────────┘
                      ↓
              ┌──────────────┐
              │   Download   │
              └──────┬───────┘
                     ↓
              ┌──────────────┐
              │  Processing  │
              └──────┬───────┘
                     ↓
              ┌──────────────┐
              │  MP3 Ready   │
              └──────┬───────┘
                     ↓
              ┌──────────────┐
              │ Local Device │
              └──────────────┘
```

Urutan pengerjaan **jangan langsung mulai dari FFmpeg**. Mulai dari **React + Tailwind → UI dummy → backend API → search/metadata → job system → FFmpeg/audio processing → local download → security & testing**. Dengan urutan ini, kalau terjadi error di bagian downloader, kamu sudah tahu bahwa UI dan API dasarnya memang sudah bekerja.
