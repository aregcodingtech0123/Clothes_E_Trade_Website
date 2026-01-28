// server.ts: Sunucu Başlatma
import app from './app';  // app.ts dosyasından dışarı aktarılan Express uygulamasını içe aktarır.
//import 'express-async-errors'; // Asenkron hata yakalamayı kolaylaştırmak için kullanılabilir.
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000; // .env dosyasından veya varsayılan olarak 5000. porttan okunur

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});