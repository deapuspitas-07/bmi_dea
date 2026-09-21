# BMI & Pemantau Jarak — Expo SDK 54

Aplikasi single screen React Native untuk tugas sekolah:
- Kalkulator BMI: gender, usia, berat, tinggi, hasil BMI, kategori, dan rentang rekomendasi berat.
- Pemantau aktivitas: GPS, jarak, durasi, kecepatan, kalori estimasi.
- Tombol Mulai, Berhenti, dan Reset.
- Seluruh fitur berada dalam satu `ScrollView` tanpa React Navigation.
- Masing-masing bagian memiliki gambar/ikon lokal.

## Versi teknis

- Expo SDK 54
- React Native 0.81.x
- React 19.1.0
- expo-location ~19.0.8

Expo SDK 54 menargetkan React Native 0.81 dan React 19.1. `expo-location` versi yang direkomendasikan pada dokumentasi SDK 54 adalah ~19.0.8.

## Menjalankan project

1. Extract ZIP.
2. Buka folder project di VS Code.
3. Buka terminal pada folder project.
4. Jalankan:

```bash
npm install
npx expo start
```

5. Scan QR menggunakan Expo Go di HP.
6. Saat pertama kali menekan **Mulai**, izinkan akses lokasi.

## Catatan GPS

- Pengujian terbaik dilakukan di HP fisik.
- Aktifkan GPS/lokasi pada HP.
- Saat bergerak sangat lambat atau berada di dalam ruangan, GPS dapat menghasilkan perubahan posisi kecil/berisik.
- Aplikasi ini hanya meminta lokasi saat aplikasi digunakan (foreground), sesuai kebutuhan tugas.

## Catatan BMI

Aplikasi menghitung BMI sesuai rumus tugas: berat (kg) / tinggi (m)^2.
Rentang kategori yang dipakai: <18.5 kurus, 18.5–24.9 normal, 25–29.9 gemuk, >=30 obesitas.
Rentang rekomendasi berat dihitung dari BMI 18.5–24.9.

Untuk keperluan medis, terutama pada pengguna di bawah 18 tahun, BMI tidak sebaiknya ditafsirkan memakai kategori dewasa saja; penilaian klinis anak/remaja menggunakan acuan pertumbuhan yang sesuai usia dan jenis kelamin.

## Kalori

Kalori adalah estimasi sederhana berbasis berat badan dan jarak tempuh, bukan pengukuran sensor medis.
