export interface Rempah {
  id: string;
  nama: string;
  namaJawa: string;
  asset: string;
  width: number;
  height: number;
  peran: string;
  makanan: string;
}

export const rempahData: Rempah[] = [
  { id: 'kluwek', nama: 'Kluwek', namaJawa: 'Kluwak', asset: '/rempah/rempah-7.webp', width: 340, height: 320, peran: 'Memberi warna hitam legam dan rasa bumi yang khas. Jiwa dari Rawon dan Gudeg.', makanan: 'Rawon, Gudeg, Brongkos' },
  { id: 'kemiri', nama: 'Kemiri', namaJawa: 'Kemiri', asset: '/rempah/rempah-6.webp', width: 320, height: 300, peran: 'Pengental bumbu alami. Memberi rasa gurih dan creamy pada masakan bersantan.', makanan: 'Opor Ayam, Soto, Gulai' },
  { id: 'daun-salam', nama: 'Daun Salam', namaJawa: 'Godhong Salam', asset: '/rempah/rempah-8.webp', width: 400, height: 250, peran: 'Aromatik dasar masakan Jawa. Selalu hadir di awal menumis bersama lengkuas.', makanan: 'Nasi Liwet, Gudeg, Lodeh' },
  { id: 'serai', nama: 'Serai', namaJawa: 'Sereh', asset: '/rempah/rempah-2.webp', width: 250, height: 420, peran: 'Wangi segar sitrus yang khas. Dimemarkan sebelum dimasak untuk melepas aroma.', makanan: 'Rendang, Soto Ayam, Tengkleng' },
  { id: 'lengkuas', nama: 'Lengkuas', namaJawa: 'Laos', asset: '/rempah/rempah-3.webp', width: 350, height: 300, peran: 'Aroma hangat dan sedikit pedas. Pasangan setia daun salam dalam bumbu Jawa.', makanan: 'Ayam Goreng, Opor, Gudeg' },
  { id: 'kencur', nama: 'Kencur', namaJawa: 'Cikur', asset: '/rempah/rempah-4.webp', width: 330, height: 280, peran: 'Rasa pedas earthy yang unik. Wajib hadir di pecel, rujak, dan jamu tradisional.', makanan: 'Pecel, Rujak Cingur, Jamu Beras Kencur' },
  { id: 'ketumbar', nama: 'Ketumbar', namaJawa: 'Ketumbar', asset: '/rempah/rempah-5.webp', width: 300, height: 300, peran: 'Biji bulat wangi sitrus-rempah. Ditumbuk menjadi bumbu dasar yang aromatik.', makanan: 'Ayam Goreng Jawa, Soto, Semur' },
  { id: 'gula-merah', nama: 'Gula Merah', namaJawa: 'Gula Jawa', asset: '/rempah/rempah-15.webp', width: 340, height: 340, peran: 'Pemanis alami khas Jawa. Memberi rasa manis legit dan warna kecoklatan khas.', makanan: 'Gudeg, Semur, Sayur Lodeh' },
  { id: 'kunyit', nama: 'Kunyit', namaJawa: 'Kunir', asset: '/rempah/rempah-1.webp', width: 360, height: 280, peran: 'Pewarna alami kuning keemasan. Rasa pahit ringan yang khas dan kaya manfaat.', makanan: 'Opor Ayam, Nasi Kuning, Gulai' },
  { id: 'jahe', nama: 'Jahe', namaJawa: 'Jae', asset: '/rempah/rempah.webp', width: 380, height: 300, peran: 'Rasa pedas hangat yang menghangatkan. Dominan di wedang dan masakan berkuah.', makanan: 'Wedang Jahe, Tengkleng, Soto' },
  { id: 'bawang-merah', nama: 'Bawang Merah', namaJawa: 'Brambang', asset: '/rempah/rempah-16.webp', width: 300, height: 330, peran: 'Aroma manis tajam. Dasar hampir semua bumbu masak Jawa dan Indonesia.', makanan: 'Semua masakan Jawa, Bawang Goreng, Sambal' },
  { id: 'daun-jeruk', nama: 'Daun Jeruk', namaJawa: 'Godhong Jeruk', asset: '/rempah/rempah-9.webp', width: 350, height: 280, peran: 'Segar sitrus, wangi yang khas. Menyegarkan masakan berkuah santan tebal.', makanan: 'Opor, Rendang, Pepes, Soto' },
  { id: 'pala', nama: 'Pala', namaJawa: 'Pala', asset: '/rempah/rempah-13.webp', width: 320, height: 320, peran: 'Kompleksitas rasa manis pedas yang tak terganti. Wajib untuk olahan daging manis.', makanan: 'Semur, Galantin, Sup Jawa' },
  { id: 'terasi', nama: 'Terasi', namaJawa: 'Trasi', asset: '/rempah/rempah-19.webp', width: 340, height: 280, peran: 'Fermentasi udang beraroma kuat. Memberi kedalaman rasa umami yang tak tergantikan.', makanan: 'Sambal Terasi, Pecel, Plecing Kangkung' },
  { id: 'asam-jawa', nama: 'Asam Jawa', namaJawa: 'Asem Jawa', asset: '/rempah/rempah-14.webp', width: 350, height: 280, peran: 'Rasa asam segar alami. Menyeimbangkan rasa manis dan gurih dalam masakan.', makanan: 'Sayur Asem, Garang Asem, Pindang' },
  { id: 'bunga-lawang', nama: 'Bunga Lawang', namaJawa: 'Pekak', asset: '/rempah/rempah-17.webp', width: 360, height: 360, peran: 'Anise yang dramatis & harum. Penting untuk hidangan daging berkuah hitam premium.', makanan: 'Rawon premium, Sup Buntut, Wedang' },
  { id: 'kapulaga', nama: 'Kapulaga', namaJawa: 'Kapulaga', asset: '/rempah/rempah-12.webp', width: 330, height: 280, peran: 'Rasa segar sedikit manis floral. Sering dipakai utuh di masakan berkuah dan minuman.', makanan: 'Nasi Uduk, Wedang Ronde, Soto Betawi' },
  { id: 'cengkeh', nama: 'Cengkeh', namaJawa: 'Cengkeh', asset: '/rempah/rempah-11.webp', width: 300, height: 300, peran: 'Aroma sangat kuat, pedas manis. Sedikit saja sudah cukup memberi karakter masakan.', makanan: 'Semur Jawa, Rendang, Gulai' },
  { id: 'kayu-manis', nama: 'Kayu Manis', namaJawa: 'Kayu Manis', asset: '/rempah/rempah-10.webp', width: 380, height: 250, peran: 'Manis hangat aromatik. Dipakai batangan utuh di masakan berkuah dan kari Jawa.', makanan: 'Semur, Rendang, Kolak' },
  { id: 'kayu-secang', nama: 'Kayu Secang', namaJawa: 'Secang', asset: '/rempah/rempah-18.webp', width: 350, height: 280, peran: 'Pewarna merah & antioksidan kuat. Tulang punggung minuman tradisional Jawa.', makanan: 'Wedang Uwuh — identitas minuman Jawa' },
];
