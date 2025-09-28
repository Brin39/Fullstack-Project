"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const admin_1 = __importDefault(require("./routes/admin"));
// טוען משתני סביבה
dotenv_1.default.config();
// חיבור לבסיס הנתונים
(0, db_1.default)();
const app = (0, express_1.default)();
// מינימום
const origins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim());
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (!origin || origins.includes(origin))
            return cb(null, true);
        cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(express_1.default.static('public'));
// מסלול בסיס
app.get('/', (_, res) => {
    res.json({ message: 'API is working' });
});
// חיבור מסלולים
app.use('/api/users', userRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/admin', admin_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
