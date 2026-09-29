Design brief ini ditetapkan sebagai **baseline desain sebelum coding**. Sengaja dibuat bukan seperti dashboard SaaS generik, karena produk ini adalah **utility personal**: pengguna datang, mencari audio, memilih kualitas, lalu selesai.

# Design Brief — Personal YouTube Music Downloader

## 1. Design Principles

### 01 — Search-first, bukan feature-first

**Prinsip:** pengguna harus langsung tahu apa yang harus dilakukan ketika membuka aplikasi.

Prioritas visual:

```text
Search / URL
      ↓
Hasil
      ↓
Preview
      ↓
Download
```

Bukan:

```text
Dashboard
Statistics
Recent Downloads
Recommendations
...
```

**Alasan:** aplikasi tidak memiliki history, akun, playlist, atau fitur sosial. Menambahkan dashboard kompleks hanya membuat utility sederhana terasa berat.

---

### 02 — Satu primary action pada satu waktu

Setiap kondisi layar hanya mempunyai **satu CTA utama**.

Contoh:

```text
Belum memilih media
→ Search

Sudah memilih media
→ Download MP3

Sedang processing
→ tidak ada CTA competing

Selesai
→ Download file
```

Secondary action boleh ada, tetapi tidak boleh secara visual mengalahkan primary action.

**Alasan:** user tidak perlu mengambil banyak keputusan. Ini adalah workflow linear.

---

### 03 — Feedback harus selalu terlihat

Setiap tindakan user harus menghasilkan respons visual.

Contoh:

```text
Search
→ Loading

Select
→ Preview muncul

Download
→ Processing

Processing selesai
→ Download ready

Error
→ Penjelasan + retry
```

Tidak boleh ada kondisi:

> "Saya sudah klik, tapi tidak tahu sedang terjadi apa."

**Alasan:** proses audio bisa membutuhkan waktu. Feedback menjadi bagian utama dari UX, bukan dekorasi.

---

# 2. Visual Direction

## Mood

Visual direction:

> **Dark, focused, technical, tetapi tetap friendly.**

Bayangkan gabungan:

* modern audio utility
* developer tool
* music player minimal
* sedikit nuansa **dark studio**

Bukan tampilan:

* YouTube clone
* Spotify clone
* admin dashboard
* cyberpunk berlebihan

---

## Warna utama

### Background

```text
Primary Background
#0B0D12
```

Hampir hitam tetapi memiliki sedikit nuansa biru.

Alasannya:

* nyaman untuk UI yang digunakan cukup lama
* thumbnail dan artwork lebih menonjol
* terasa seperti utility modern
* tidak terlihat seperti website hitam polos

---

### Surface

```text
Surface 1
#12151C

Surface 2
#181C24

Surface 3
#202530
```

Hierarchy:

```text
#0B0D12
   ↓
#12151C
   ↓
#181C24
   ↓
#202530
```

---

### Primary accent

**Electric violet**:

```text
Primary
#8B5CF6
```

Hover:

```text
#7C3AED
```

Soft background:

```text
#2E1A55
```

Alasan memilih violet:

* cocok dengan produk audio/digital
* berbeda dari warna merah YouTube
* tidak membuat aplikasi terasa seperti clone YouTube
* tetap jelas di dark UI

---

### Text

```text
Primary text
#F5F7FA

Secondary text
#A7AFBF

Muted text
#6B7280
```

---

### Semantic colors

Success:

```text
#22C55E
```

Error:

```text
#EF4444
```

Warning:

```text
#F59E0B
```

Info:

```text
#38BDF8
```

Semantic colors **tidak digunakan sebagai dekorasi utama**. Hanya untuk status.

---

# 3. Design Tokens

## 3.1 Typography

Font:

> **Inter**

Alasan:

* sangat readable pada UI utility
* angka bitrate dan duration tetap mudah dibaca
* bagus pada ukuran kecil
* cocok untuk interface teknis
* tersedia dengan baik dan ringan

### Type scale

```text
Display
36px / 44px
Weight 700

H1
30px / 38px
Weight 700

H2
24px / 32px
Weight 600

H3
18px / 26px
Weight 600

Body
16px / 24px
Weight 400

Body Small
14px / 20px
Weight 400

Caption
12px / 16px
Weight 500
```

Untuk aplikasi ini **tidak perlu font 5–6 keluarga berbeda**.

Satu font family cukup.

---

## 3.2 Spacing

Menggunakan base scale **4px**.

```text
4px   → xs
8px   → sm
12px  → md
16px  → lg
20px  → xl
24px  → 2xl
32px  → 3xl
40px  → 4xl
48px  → 5xl
64px  → 6xl
80px  → 7xl
```

Rule:

* component internal: 8–16px
* card padding: 16–20px
* section spacing: 32–48px
* hero spacing: 48–80px

---

## 3.3 Radius

Tidak menggunakan radius ekstrem.

```text
4px   → small
8px   → button/input
12px  → card
16px  → large card
20px  → hero container
999px → pill
```

Default component:

> **12px**

Ini membuat UI modern tetapi tetap terasa seperti utility, bukan aplikasi mobile playful.

---

## 3.4 Shadow

Dark UI tidak membutuhkan shadow besar.

```text
Small
0 2px 8px rgba(0,0,0,.20)

Medium
0 8px 24px rgba(0,0,0,.25)

Large
0 16px 40px rgba(0,0,0,.30)
```

Shadow hanya untuk:

* modal
* floating element
* elevated preview

Card biasa menggunakan **border + surface contrast**, bukan shadow.

---

# 4. Screen Inventory

MVP cukup dengan **1 screen utama + state/overlay**.

| Screen              | Tujuan                        |
| ------------------- | ----------------------------- |
| Home                | Search dan entry point utama  |
| Search Results      | Menampilkan hasil pencarian   |
| Media Preview       | Memastikan media yang dipilih |
| Download Processing | Menampilkan proses conversion |
| Download Complete   | Memberikan file final         |
| Error State         | Menangani kegagalan           |
| URL Input State     | Direct URL workflow           |

Tidak perlu membuat:

```text
Dashboard
History
Profile
Settings
Library
Playlist
```

karena tidak ada requirement untuk itu.

---

# 5. User Flow

## Journey A — Search

```text
Open App
   ↓
Home
   ↓
Enter keyword
   ↓
Click Search
   ↓
Loading
   ↓
Search Results
   ↓
Select media
   ↓
Media Preview
```

---

## Journey B — Direct URL

```text
Open App
   ↓
Paste URL
   ↓
Process
   ↓
Loading
   ↓
Media Preview
```

---

## Journey C — Download

```text
Media Preview
   ↓
Select bitrate
   ↓
MP3 selected
   ↓
Download
   ↓
Processing
   ↓
Conversion
   ↓
Completed
   ↓
Download File
```

---

## Journey D — Error

```text
Action
 ↓
Error
 ↓
Explain problem
 ↓
Retry
 ↓
Previous flow
```

Error tidak boleh membuat user kembali ke homepage tanpa alasan.

---

# 6. Layout Per Screen

## Screen 01 — Home

### Desktop

```text
┌──────────────────────────────────────────────────┐
│  ◉ AudioDrop                         Personal     │
│                                                  │
│                                                  │
│               Download your audio                │
│               from authorized sources            │
│                                                  │
│       ┌──────────────────────────────────┐       │
│       │ 🔍 Search title or artist...     │       │
│       └──────────────────────────────────┘       │
│                                                  │
│                    OR                            │
│                                                  │
│       ┌──────────────────────────────────┐       │
│       │ Paste media URL                  │       │
│       └──────────────────────────────────┘       │
│                                                  │
│       Search by title, artist, or keyword        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Hierarchy

1. Logo
2. Headline
3. Search
4. URL input
5. supporting text

### Primary action

**Search**

### Secondary action

**Process URL**

---

## Screen 02 — Search Results

Hero tidak lagi diperlukan.

Layout:

```text
Search
────────────────────────────────

Search results

┌────────────────────────────────────┐
│ Thumbnail │ Title                  │
│           │ Artist / Channel       │
│           │ 04:32          Select  │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Thumbnail │ Title                  │
│           │ Artist / Channel       │
│           │ 03:21          Select  │
└────────────────────────────────────┘
```

### Component

`SearchResultCard`

### Primary action

`Select`

---

## Screen 03 — Media Preview

Ini menjadi **decision screen**.

```text
┌──────────────────────────────────────────┐
│                                          │
│  ┌───────────────┐                       │
│  │               │  Song Title           │
│  │   Artwork     │  Artist               │
│  │               │  Album                │
│  └───────────────┘  04:32                │
│                                          │
│  Format                                  │
│  [ MP3 ]                                 │
│                                          │
│  Bitrate                                 │
│  [128] [192] [256] [320]                │
│                                          │
│       [ Download MP3 ]                   │
│                                          │
└──────────────────────────────────────────┘
```

### Primary action

**Download MP3**

### Design decision

Bitrate dibuat **segmented control**, bukan dropdown.

Karena hanya ada 4 pilihan dan semuanya perlu terlihat.

---

## Screen 04 — Processing

Jangan membuat user melihat detail teknis FFmpeg.

Jangan:

```text
Running FFmpeg...
Executing process...
Encoding stream...
```

Gunakan:

```text
Preparing your audio

████████████░░░░░░  68%

Converting to MP3
```

Tahap:

```text
Preparing
Converting
Finalizing
```

---

## Screen 05 — Complete

```text
┌─────────────────────────────┐
│            ✓                │
│                             │
│     Your audio is ready     │
│                             │
│     Song Title.mp3          │
│     MP3 · 192 kbps          │
│                             │
│     [ Download File ]       │
│                             │
│     Process another         │
└─────────────────────────────┘
```

### Primary

**Download File**

### Secondary

**Process another**

---

# 7. Component Library

## Button

### Variants

```text
Primary
Secondary
Ghost
Danger
```

### States

```text
Default
Hover
Focus
Active
Disabled
Loading
```

Primary:

```text
background: #8B5CF6
text: #FFFFFF
```

---

## SearchInput

Variants:

```text
Default
Focused
Filled
Loading
Error
Disabled
```

---

## URLInput

States:

```text
Empty
Focused
Valid
Invalid
Processing
```

---

## SearchResultCard

States:

```text
Default
Hover
Focused
Selected
Loading
```

---

## MediaPreview

Variants:

```text
Default
Compact
Mobile
```

---

## BitrateSelector

Options:

```text
128
192
256
320
```

States:

```text
Unselected
Selected
Hover
Focus
Disabled
```

---

## DownloadButton

States:

```text
Ready
Loading
Disabled
Completed
Error
```

---

## Progress

Variants:

```text
Indeterminate
Determinate
```

Jangan menampilkan angka progress jika backend sebenarnya tidak menyediakan progress yang valid.

---

## Alert

Variants:

```text
Success
Error
Warning
Info
```

---

# 8. State Design

## Home

### Empty

```text
Download your audio
Search by title, artist, or keyword
```

### Loading

```text
Searching...
```

### Error

```text
Couldn't complete the search.
[Try again]
```

### Offline

```text
You're offline.
Check your connection and try again.
```

---

## Search Results

### Loading

Skeleton cards:

```text
████████
██████████████
████████
```

Jangan menggunakan spinner besar di tengah layar karena hasil sebenarnya berbentuk list.

### Empty

```text
No results found

Try another title or artist.
```

### Error

```text
Search couldn't be completed.

[Try again]
```

---

## Media Preview

### Loading

Artwork skeleton + metadata skeleton.

### Error

```text
This media couldn't be loaded.

[Try again]
```

### Success

Metadata + bitrate + Download.

---

## Download Processing

### Loading

```text
Preparing your audio
████████░░░░
```

### Error

```text
We couldn't create the audio file.

[Try again]
```

### Success

Automatically transition ke Complete.

---

## Download Complete

### Success

Green check + filename + download CTA.

### Error

Jika browser download gagal:

```text
The file was created, but the download couldn't start.

[Download again]
```

---

# 9. Responsive Behaviour

## Mobile — < 640px

Layout:

```text
padding: 16px
```

Search input full width.

Result card:

```text
┌─────────────────────────┐
│ thumbnail               │
│                         │
│ Title                   │
│ Artist                  │
│                         │
│ [ Select ]              │
└─────────────────────────┘
```

Media preview menjadi vertical:

```text
Artwork
↓
Title
↓
Metadata
↓
Bitrate
↓
Download
```

Primary button:

```text
width: 100%
```

---

## Tablet — 640–1024px

Container:

```text
max-width: 720px
```

Result tetap vertical list.

Media preview boleh menggunakan:

```text
Artwork | Metadata
```

---

## Desktop — >1024px

Container:

```text
max-width: 960px
```

Home hero:

```text
max-width: 720px
```

Media preview:

```text
Artwork | Information
```

Result list tidak dibuat terlalu lebar.

---

## Responsive principle

Yang berubah:

```text
layout
spacing
component width
```

Yang **tidak berubah**:

```text
information hierarchy
primary CTA
workflow
color meaning
```

---

# 10. Accessibility

## Contrast

Target utama:

> **WCAG AA**

Minimal:

```text
Normal text: 4.5:1
Large text: 3:1
UI components: 3:1
```

Primary violet harus digunakan dengan hati-hati untuk text kecil. Untuk text di atas violet, gunakan putih.

---

## Focus

Semua interactive element harus mempunyai visible focus.

Contoh:

```text
Search input
    ↓
Search button
    ↓
Result 1
    ↓
Result 2
    ↓
...
```

Focus ring:

```text
2px solid #A78BFA
```

dengan offset.

---

## Keyboard Navigation

User harus bisa melakukan seluruh workflow tanpa mouse:

```text
Tab
 ↓
Search
 ↓
Search button
 ↓
Result
 ↓
Select
 ↓
Bitrate
 ↓
Download
```

Shortcut tambahan seperti `/` untuk fokus search **tidak wajib untuk MVP**, tetapi dapat menjadi enhancement.

---

## ARIA

### Search

```html
role="search"
```

Search input:

```text
aria-label="Search for audio"
```

---

### Loading

Gunakan:

```text
aria-live="polite"
```

untuk perubahan status.

Contoh:

```text
"Search completed. 8 results found."
```

---

### Error

Error message:

```text
role="alert"
```

Tetapi jangan membuat setiap perubahan kecil menjadi alert.

---

### Progress

Gunakan:

```text
role="progressbar"
aria-valuenow
aria-valuemin
aria-valuemax
```

**hanya jika progress memang determinate.**

Jika tidak tahu persentasenya:

```text
aria-busy="true"
```

dan gunakan status seperti:

> "Converting audio."

---

# Final Visual Specification

Ringkasan seluruh keputusan di atas:

```text
PRODUCT
Personal Audio Utility

STYLE
Dark / Focused / Technical / Minimal

FONT
Inter

BACKGROUND
#0B0D12

SURFACES
#12151C
#181C24
#202530

PRIMARY
#8B5CF6

TEXT
#F5F7FA
#A7AFBF
#6B7280

SUCCESS
#22C55E

ERROR
#EF4444

RADIUS
8 / 12 / 16px

SPACING
4px base scale

MAIN WIDTH
960px

HERO WIDTH
720px

PRIMARY FLOW
Search
→ Select
→ Configure
→ Download
→ Complete
```

### Keputusan desain yang paling penting

**Tidak ada** sidebar, dashboard, navbar besar, history panel, atau kartu-kartu statistik. Untuk produk ini itu justru mengganggu tujuan utama. Struktur yang dipakai adalah **single-task utility**: satu halaman, satu workflow, dan interface berubah berdasarkan state.

Tahap berikutnya seharusnya **bukan langsung membuat `App.jsx`**. Tahap desain berikutnya adalah membuat **wireframe low-fidelity untuk Home → Results → Preview → Processing → Complete**, baru setelah hierarchy-nya masuk akal diturunkan menjadi komponen React + Tailwind.
