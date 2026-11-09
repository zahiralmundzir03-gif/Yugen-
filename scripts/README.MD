# YŪGEN NEXUS — Cloud Edition

Paket ini menggunakan HTML Yūgen Nexus yang kamu unggah sebagai frontend utama, Netlify untuk hosting, dan Supabase untuk autentikasi serta database akun cloud.

## Fitur cloud yang disiapkan

- Registrasi akun dengan username, email, dan password.
- Login menggunakan email dan password.
- Verifikasi email dengan kode 6 digit (OTP) dari Supabase Auth.
- Profil akun tersimpan di tabel `public.profiles`.
- UUID akun berasal dari Supabase Auth dan stabil.
- Role `basic`, `vip`, `owner`, dan `developers` disimpan di database.
- RLS (Row Level Security) membatasi akses profil.
- Perubahan profil menggunakan Supabase Realtime.
- RPC khusus untuk admin mengubah role dan menghapus akun.
- Tidak ada akun developer/password bawaan yang ditanam di HTML.

> Database ini menyimpan identitas dan profil akun. Pengaturan lokal lain dan data fitur lain dalam HTML asli belum otomatis dipindahkan ke cloud. API downloader/layanan pihak ketiga yang dipanggil HTML juga tetap mengikuti CORS dan kebijakan masing-masing penyedia.

## Struktur

```text
YUGEN-NEXUS-CLOUD/
├── public/
│   ├── index.html
│   └── supabase-config.js
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── docs/
│   └── PANDUAN-INSTALASI-ID.md
├── netlify.toml
├── package.json
└── README.md
```

## Mulai cepat

Ikuti `docs/PANDUAN-INSTALASI-ID.md` dari awal sampai akhir. ZIP ini belum dapat terhubung ke database sampai kamu membuat proyek Supabase dan mengisi konfigurasi milikmu sendiri.

## Keamanan penting

- `anon/public key` memang digunakan pada browser dan dilindungi oleh RLS.
- Jangan pernah menaruh `service_role` key, secret key, password database, atau token admin di `public/`.
- Role admin tidak bisa didapat hanya dengan mengganti nilai di browser. Promosikan akun pertama melalui SQL Editor Supabase.
- Aktifkan verifikasi email dan sesuaikan template email menjadi kode OTP `{{ .Token }}`.
- Gunakan password kuat dan batasi redirect URL ke domain yang benar.
