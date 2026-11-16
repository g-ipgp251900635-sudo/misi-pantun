# Misi Pantun — Level 1 (Tahun 5)

Projek percuma untuk GitHub Pages + Google Sheets + Google Apps Script.

## Kandungan
- `index.html`, `style.css`, `app.js`, `config.js`: permainan murid.
- `assets/video-pantun.mp4` dan `assets/audio-pantun.mp3`: bahan asal yang diberikan.
- `Code.gs`: backend simpanan rekod dan dashboard guru.

## 1. Sediakan Google Sheets
Buka spreadsheet sasaran, pilih **Extensions → Apps Script**. Tampal kandungan `Code.gs`. Dalam **Project Settings → Script Properties**, tambah:
- `SPREADSHEET_ID` = ID spreadsheet (bahagian di antara `/d/` dan `/edit` pada URL).
- `TEACHER_EMAIL` = alamat Gmail guru yang dibenarkan melihat dashboard.

Jalankan fungsi `doPost` tidak perlu secara manual. Benarkan akses apabila Google memintanya.

## 2. Deploy endpoint murid (untuk simpan keputusan)
Dalam Apps Script pilih **Deploy → New deployment → Web app**:
- Execute as: **Me**
- Who has access: **Anyone**
Salin URL `/exec` yang terhasil. Masukkan URL itu dalam `config.js` pada `STUDENT_API_URL`.

## 3. Deploy dashboard guru secara berasingan
Buat deployment Web app kedua daripada projek Apps Script yang sama:
- Execute as: **User accessing the web app**
- Who has access: **Anyone with Google account**
Log masuk menggunakan akaun Google yang sama dengan nilai `TEACHER_EMAIL`. Buka URL deployment kedua untuk dashboard. Google mungkin meminta kebenaran akses pada kali pertama.

Nota: Jika tetapan organisasi/akaun Google tidak menawarkan pilihan ini, jangan dedahkan spreadsheet kepada umum. Guru masih boleh menyemak rekod terus dalam spreadsheet peribadi.

## 4. Terbitkan permainan melalui GitHub Pages
Muat naik semua kandungan folder ini (termasuk folder `assets`) ke repository GitHub. Buka **Settings → Pages**, pilih branch `main` dan folder `/ (root)`, kemudian Save. Tunggu URL Pages diberikan. Masukkan URL itu ke Google Sites melalui **Insert → Embed → URL**.

## Nota pemarkahan
Kuiz mengandungi 10 soalan, 1 markah setiap satu. Soalan objektif ditanda automatik. Jawapan subjektif diperiksa menggunakan padanan kata kunci yang ditetapkan dalam kod; guru wajar menyemak jawapan dalam dashboard/Sheets jika terdapat variasi ejaan atau frasa yang munasabah.

## Privasi dan had
Nama, kelas, markah dan jawapan murid dihantar ke Google Sheets yang dipilih. Jangan jadikan spreadsheet awam. Apps Script dan Google Sheets mempunyai kuota penggunaan percuma Google yang boleh berubah. Projek ini tidak memerlukan hosting berbayar atau pangkalan data berbayar.
