import express, {Express} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { configurePassport } from './config/passport';

const app: Express = express();

app.use(cors({
   origin: process.env.CORS_ORIGIN,
   credentials: true,
}))

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static('public'));

app.use(cookieParser());

configurePassport(app);

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

export { app };