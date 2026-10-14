# Delcom Link Tree - Praktikum 6 PABWE 2026 (Svelte)

Aplikasi **Delcom Link Tree** dibangun menggunakan **Svelte 5** dan **Tailwind CSS** untuk Praktikum 6 Pemrograman Aplikasi Berbasis Web (PABWE) 2026.

## 🌐 Live URL & Deployment
- **Production URL**: [https://ifs24023-pabwe2026-sk-p6-svelte.yogitrim.my.id](https://ifs24023-pabwe2026-sk-p6-svelte.yogitrim.my.id)
- **Deployed on**: Private Home Server via Docker & Cloudflare Tunnel

## 🚀 Fitur Utama
1. **Autentikasi Pengguna**:
   - Register akun baru
   - Login dengan token autentikasi Open API Delcom
   - Sesi tersimpan aman di local storage / state
2. **Manajemen Link Tree**:
   - Tambah tautan baru (title, url, icon, status)
   - Ubah data tautan dan urutan (reorder)
   - Toggle status aktif/nonaktif tautan
   - Hapus tautan
3. **Tampilan Publik & Profil**:
   - Halaman publik Link Tree yang responsif dan elegan
   - Manajemen profil: ubah foto profil dan kata sandi
4. **Kualitas & Pengujian Kode**:
   - **100% Test Coverage** (Statements, Branches, Functions, Lines) menggunakan Vitest dan `@testing-library/svelte`.

## 🛠️ Menjalankan Secara Lokal

### Prasyarat
- [Bun](https://bun.sh/) atau [Node.js](https://nodejs.org/) (v18+)

### Instalasi & Menjalankan
```bash
# 1. Install dependensi
bun install

# 2. Setup environment
cp .env.example .env

# 3. Jalankan mode pengembangan
bun run dev

# 4. Menjalankan pengujian coverage (100% coverage)
bun run test:coverage

# 5. Build untuk produksi
bun run build
bun run preview
```
