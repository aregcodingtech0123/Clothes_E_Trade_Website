// app.ts: Express Uygulama Yapılandırması
import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './utils/errorHandler'; // Varsayılan hata işleyicileri
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import brandRoutes from './routes/brandRoutes';
import orderRoutes from './routes/orderRoutes';
import contactRoutes from './routes/contactRoutes';
import { responseEnhancer } from './middlewares/responseEnhancer';

const app = express();

// Middleware'ler
app.use(cors({credentials:true})); // Cross-Origin Resource Sharing'i etkinleştirir.
app.use(express.json()); // Gelen isteklerin JSON gövdesini ayrıştırır.
app.use(responseEnhancer); // burada ekleniyor

// Rotalar
app.use('/api/auth', authRoutes);       // Yetkilendirme rotaları
app.use('/api/users', userRoutes);       // Kullanıcı rotaları
app.use('/api/products', productRoutes);    // Ürün rotaları
app.use('/api/categories', categoryRoutes); // Kategori rotaları
app.use('/api/brands', brandRoutes);       // Marka rotaları
app.use('/api/orders', orderRoutes);       // Sipariş rotaları
app.use('/api/contacts',contactRoutes)

// Hata Yönetimi
app.use(notFound);       // 404 Hatası işleyicisi (Önce diğer rotalar tanımlanmalı)
app.use(errorHandler);  // Genel hata işleyicisi (Son olarak tanımlanmalı)

// NOT: app.listen burada çağrılmamalı!
export default app; // Dışarı aktarılarak server.ts tarafından kullanılabilir.