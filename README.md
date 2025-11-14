# Asoy Chat - AI Chat dengan Pelatihan Data

Website chat berbasis AI yang terinspirasi dari ChatGPT, dengan kemampuan menyimpan percakapan dan melatih ulang model AI secara otomatis.

## Fitur

- 💬 **Chat Interface** — UI modern seperti ChatGPT untuk mengirim dan menerima pesan
- 🧠 **Model AI Markov** — Algoritma Markov Chain sederhana untuk generate respons
- 💾 **Auto-Save Conversations** — Setiap percakapan disimpan otomatis ke `data.json`
- 🎓 **Pelatihan Model** — Latih ulang model dari data percakapan via API atau CLI
- 📊 **Riwayat Percakapan** — Akses semua percakapan yang tersimpan melalui API
- 🔧 **Debugging Console** — Pantau request/response di browser DevTools dan server logs

---

## Instalasi

### Prasyarat
- **Node.js** v14+ dan npm

### Setup

```bash
# Clone atau masuk ke folder project
cd /workspaces/Asoy

# Pasang dependencies
npm install
```

---

## Cara Jalankan

### 1. Jalankan Server

```bash
npm start
```

atau

```bash
node server.js
```

Output:
```
Server running at http://localhost:3000
```

### 2. Buka Browser

Akses: **http://localhost:3000**

Anda akan melihat UI chat (seperti ChatGPT) di folder `public/index.html`.

### 3. Mulai Chat

- Ketik pesan di input box
- Tekan "Kirim" atau Enter
- Bot akan merespons berdasarkan model yang sudah dilatih
- Percakapan otomatis tersimpan ke `data.json`

---

## Pelatihan Model

### Opsi 1: Via CLI (Recommended untuk debugging)

Jalankan script pelatihan untuk rebuild `model.json` dari `data.json`:

```bash
npm run train
```

atau

```bash
node train.js
```

Output contoh:
```
Trained model. Keys: 1245
```

**Jumlah Keys** menunjukkan berapa banyak pola yang dipelajari dari percakapan.

### Opsi 2: Via HTTP (dari Browser/Postman)

Buka tab baru atau gunakan curl:

```bash
curl -X POST http://localhost:3000/api/train
```

Response:
```json
{
  "status": "trained",
  "keys": 1245
}
```

---

## API Endpoints

### POST /api/chat
Kirim pesan dan dapatkan respons dari AI.

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Halo, apa kabar?"}'
```

**Response:**
```json
{
  "reply": "Halo juga! Saya baik-baik saja. Bagaimana dengan Anda?"
}
```

### POST /api/train
Latih model dari data di `data.json`.

**Request:**
```bash
curl -X POST http://localhost:3000/api/train
```

**Response:**
```json
{
  "status": "trained",
  "keys": 1245
}
```

### GET /api/conversations
Ambil semua percakapan yang tersimpan.

**Request:**
```bash
curl http://localhost:3000/api/conversations
```

**Response:**
```json
[
  {
    "timestamp": "2025-11-14T10:30:00.000Z",
    "user": "Halo, apa kabar?",
    "bot": "Baik-baik saja, terima kasih sudah bertanya!"
  },
  {
    "timestamp": "2025-11-14T10:30:05.000Z",
    "user": "Siapa nama kamu?",
    "bot": "Nama saya Asoy, senang berkenalan dengan Anda."
  }
]
```

---

## Struktur File

```
Asoy/
├── server.js              # Server Express utama, definisi API
├── train.js               # Script pelatihan model offline
├── data.json              # Database percakapan (auto-updated)
├── model.json             # Model Markov (output dari train.js)
├── package.json           # Dependencies & scripts
├── public/
│   ├── index.html         # UI Chat (halaman utama)
│   ├── app.js             # Frontend JavaScript
│   └── style.css          # Styling (jika ada)
└── README.md              # Dokumentasi ini
```

### Penjelasan File Penting

| File | Fungsi |
|------|--------|
| `server.js` | Server Express yang melayani API `/api/chat`, `/api/train`, `/api/conversations` dan static file dari `public/` |
| `train.js` | CLI script untuk latih model. Baca `data.json`, build Markov model, tulis ke `model.json` |
| `data.json` | Array JSON berisi semua percakapan `{timestamp, user, bot}`. Di-update saat `/api/chat` dipanggil |
| `model.json` | Model Markov (key-value pairs) hasil latihan. Dipakai untuk generate respons |
| `public/index.html` | UI Chat yang diserve di `/` |
| `public/app.js` | Client-side JavaScript untuk handle input, fetch API, display chat |

---

## Cara Debugging

### 1. Terminal Server
Pantau logs saat ada request masuk:
```bash
node server.js
```

Contoh output:
```
Server running at http://localhost:3000
POST /api/chat - user: "Halo"
POST /api/train - training...
```

### 2. Browser DevTools
- Tekan **F12** → buka tab **Console** dan **Network**
- Lihat request ke `/api/chat`, respons, dan error messages
- Console akan tampil jika ada JS error di frontend

### 3. Hot-Reload Saat Edit
Gunakan `nodemon` untuk auto-restart server saat file berubah:

```bash
npx nodemon server.js
```

### 4. Lihat File JSON
```bash
# Lihat isi data.json
cat data.json

# Lihat isi model.json (first 50 lines)
cat model.json | head -50

# Format indented untuk readability
cat data.json | jq .
cat model.json | jq . | head -100
```

### 5. Test API Manual
```bash
# Test chat endpoint
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' | jq .

# Test train endpoint
curl -s -X POST http://localhost:3000/api/train | jq .

# Test get conversations
curl -s http://localhost:3000/api/conversations | jq .
```

---

## Workflow Typical

### Pertama Kali
1. Jalankan `npm install`
2. Jalankan `npm start`
3. Buka browser `http://localhost:3000`
4. Chat beberapa percakapan (otomatis disimpan ke `data.json`)
5. Jalankan `npm run train` untuk build model dari percakapan

### Iterasi Pengembangan
1. Edit `server.js` atau `public/app.js`
2. Jalankan `npx nodemon server.js` (auto-reload)
3. Buka DevTools (F12) untuk debugging
4. Refresh browser atau lihat perubahan otomatis

### Tingkatkan Model AI
1. Chat lebih banyak atau tambah manual entri ke `data.json`
2. Jalankan `npm run train`
3. Lihat jumlah Keys meningkat → model lebih "pintar"
4. Test di UI — respons akan lebih relevan

---

## Konfigurasi

### Ubah Port Server
```bash
PORT=8080 npm start
```

### Ubah Data/Model File Path
Edit `server.js`:
```javascript
const DATA_FILE = path.join(__dirname, 'data.json');    // ubah path
const MODEL_FILE = path.join(__dirname, 'model.json');  // ubah path
```

### Markov Order (Complexity)
Di `server.js` dan `train.js`, ubah parameter `order`:
```javascript
buildMarkov(text, 2)  // order 2 (default, lebih cepat, lebih simple)
buildMarkov(text, 3)  // order 3 (lebih kompleks, generate lebih panjang)
```

---

## Troubleshooting

### ❌ "Cannot find module 'express'"
**Solusi:** Jalankan `npm install`

### ❌ Server crash saat startup
**Solusi:** Periksa port 3000 tidak terpakai:
```bash
lsof -i :3000
# atau gunakan port lain
PORT=3001 npm start
```

### ❌ Model tidak update setelah chat
**Solusi:** Jalankan `npm run train` untuk rebuild model dari `data.json`

### ❌ Respons bot selalu sama atau generic
**Alasan:** Model belum cukup data. **Solusi:** 
- Chat lebih banyak atau tambah entri ke `data.json`
- Jalankan `npm run train`
- Lihat jumlah Keys meningkat

### ❌ `data.json` atau `model.json` kosong
**Solusi:** 
- Pastikan file exist: `ls -la *.json`
- Cek permission: `chmod 644 data.json model.json`
- Reset dengan contoh data dari sini

---

## Contoh Data Awal

Jika `data.json` kosong atau ingin reset, jalankan di terminal:

```bash
cat > data.json << 'EOF'
[
  {"timestamp": "2025-01-01T10:00:00Z", "user": "Halo", "bot": "Halo juga! Bagaimana kabar Anda?"},
  {"timestamp": "2025-01-01T10:00:05Z", "user": "Siapa nama kamu?", "bot": "Nama saya Asoy, senang berkenalan dengan Anda"},
  {"timestamp": "2025-01-01T10:00:10Z", "user": "Apa tujuan kamu?", "bot": "Saya di sini untuk membantu dan berbincang dengan Anda"},
  {"timestamp": "2025-01-01T10:00:15Z", "user": "Bagaimana cuaca hari ini?", "bot": "Saya tidak tahu cuaca sekarang, tapi saya harap cerah untuk Anda"}
]
EOF
npm run train
```

---

## Tips Optimasi

1. **Increase Training Data** — Lebih banyak percakapan = model lebih baik
2. **Diversify Conversations** — Percakapan bervariasi topik untuk generalisasi
3. **Cleanup Data** — Remove spam atau percakapan tidak relevan dari `data.json`
4. **Monitor Keys** — Output `npm run train` tunjukkan jumlah pola. Semakin banyak semakin baik
5. **Use Order 3** — Untuk generasi yang lebih panjang dan natural (tapi lebih lambat)

---

## Stack Teknologi

- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla JavaScript, HTML, CSS
- **Storage:** JSON files (`data.json`, `model.json`)
- **Algorithm:** Markov Chain (order 2+)

---

## License

MIT

---

## Kontribusi & Support

Untuk update atau pertanyaan, hubungi: **baimdevs**

---

**Happy Chatting! 🚀**
