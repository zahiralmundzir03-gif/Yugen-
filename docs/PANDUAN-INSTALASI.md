# Panduan Instalasi YŪGEN NEXUS Cloud

Ikuti berurutan. Kamu tidak perlu membuat backend atau database dari nol; file SQL dan integrasinya sudah disiapkan di paket ini.

## 1. Buat database Supabase

1. Buka https://supabase.com/ lalu masuk atau buat akun.
2. Buat **New project**. Beri nama misalnya `yugen-nexus`.
3. Pilih region terdekat yang tersedia, buat password database yang kuat, lalu tunggu provisioning selesai.
4. Buka **Project Settings → API** (atau bagian API Keys pada dashboard baru).
5. Salin **Project URL** dan **anon/public key**. Jangan salin `service_role` atau secret key.

## 2. Buat tabel dan aturan keamanan

1. Di dashboard Supabase, buka **SQL Editor**.
2. Pilih **New query**.
3. Buka file `supabase/migrations/001_initial_schema.sql` dari ZIP ini.
4. Salin seluruh isinya ke SQL Editor dan tekan **Run**.
5. Pastikan query selesai tanpa error. File tersebut membuat tabel profil, trigger pembuatan profil, RLS, fungsi admin, dan publikasi Realtime.

## 3. Hubungkan frontend ke Supabase

1. Buka `public/supabase-config.js`.
2. Ganti nilai placeholder berikut dengan data proyekmu:

```js
window.YN_SUPABASE_CONFIG = {
  url: "https://PROJECT-REF.supabase.co",
  anonKey: "SUPABASE_ANON_PUBLIC_KEY"
};
```

3. Simpan file. URL dan anon/public key boleh berada di frontend; jangan pernah memasukkan service-role key.

## 4. Atur verifikasi email OTP

1. Di Supabase, buka **Authentication → URL Configuration**.
2. Isi **Site URL** dengan domain Netlify milikmu, misalnya `https://yugen-zill.netlify.app`.
3. Tambahkan domain tersebut ke **Redirect URLs**. Tambahkan juga URL preview/development yang benar jika memang digunakan.
4. Buka **Authentication → Email Templates → Confirm signup**.
5. Atur isi email agar menampilkan kode OTP Supabase menggunakan placeholder `{{ .Token }}`. Contoh isi:

```text
Kode verifikasi Yūgen Nexus kamu: {{ .Token }}
Kode ini hanya untuk satu kali verifikasi. Jangan bagikan kepada siapa pun.
```

6. Pastikan **Email confirmations** aktif di pengaturan Authentication.
7. Untuk produksi, konfigurasi SMTP kustom sangat disarankan agar email verifikasi lebih andal. Pengiriman email bawaan Supabase dapat memiliki batasan.

## 5. Jadikan akunmu administrator pertama

1. Deploy website dan buka domainnya.
2. Daftar menggunakan email milikmu sendiri.
3. Selesaikan verifikasi email OTP.
4. Kembali ke Supabase → **SQL Editor**.
5. Jalankan query berikut dengan email yang sama persis dengan akun yang baru dibuat:

```sql
update public.profiles
set role = 'developers'
where lower(email) = lower('EMAIL_KAMU');
```

6. Logout lalu login kembali. Akun tersebut sekarang memiliki role Developers.

Jangan promosikan akun orang lain. Tidak ada username/password admin default di dalam paket.

## 6. Deploy ke Netlify

1. Ekstrak ZIP.
2. Upload folder proyek ke repository GitHub milikmu.
3. Di Netlify, hubungkan repository tersebut.
4. Build command boleh dikosongkan untuk frontend statis ini.
5. Publish directory harus `public` (sudah ditetapkan di `netlify.toml`).
6. Deploy site.
7. Setelah deploy, buka `/supabase-config.js` pada domainmu dan pastikan file berisi URL serta anon key milikmu, bukan placeholder.
8. Tes daftar akun, email OTP, logout, login, dan login ulang dari perangkat/browser lain.

## 7. Cek Realtime

Tabel `profiles` sudah dimasukkan ke publication `supabase_realtime` oleh SQL migration. Setelah login, frontend membuka subscription realtime untuk profil akun. Untuk melihat perubahan database, gunakan Supabase **Table Editor → profiles**. Perubahan role dari admin akan tersimpan di database dan dibaca lagi ketika user login atau profil dimuat ulang.

## Troubleshooting

- **Pesan Supabase belum dikonfigurasi**: periksa `public/supabase-config.js`, pastikan bukan placeholder dan sudah dideploy ulang.
- **Invalid API key**: gunakan anon/public key dari proyek yang sama dengan Project URL.
- **Email tidak menerima OTP**: cek spam, template Confirm signup memakai `{{ .Token }}`, Email confirmations aktif, dan konfigurasi SMTP.
- **Username sudah digunakan**: username bersifat unik tanpa membedakan huruf besar/kecil.
- **Akses admin ditolak**: pastikan akun sudah dipromosikan lewat SQL, lalu logout/login ulang.
- **Profil tidak ditemukan setelah verifikasi**: pastikan migration berhasil dan trigger `on_auth_user_created_yugen` ada.
- **CORS layanan lain masih error**: integrasi Supabase hanya menangani autentikasi/profil. Endpoint API pihak ketiga dalam HTML memiliki kebijakan CORS sendiri dan perlu diperiksa terpisah.

## Catatan migrasi akun lama

Akun yang sebelumnya tersimpan di localStorage/IndexedDB browser tidak otomatis dipindahkan. Jangan menyalin password lama ke database secara manual. Minta setiap pengguna membuat akun cloud baru atau rancang migrasi terverifikasi di backend jika data lama memang masih diperlukan.
