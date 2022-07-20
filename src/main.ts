import * as express from "express";
import * as cors from 'cors';
import  helmet from "helmet";
import * as morgan from "morgan";
import {config} from 'dotenv'
import userRoutes from "./routes/user";
import health from "./routes/health";
import productsRoutes from "./routes/products";
import { TokenMiddleware } from "./utils/middlewares";
import orderRoutes from "./routes/order";
import payment from "./routes/payment";

config(); 

const App = express();


App.use(express.urlencoded({ extended: true }));
App.use(express.json());

App.use("/api/uploads", express.static("uploads"));
App.use(cors());
App.use(helmet());

App.use(morgan("tiny"));
App.use('/health',health)
App.use('/api/v1/auth/',userRoutes)
App.use('/api/v1/products',TokenMiddleware,productsRoutes)
App.use('/api/v1/orders',TokenMiddleware,orderRoutes)
App.use('/api/v1/payment',TokenMiddleware,payment)

App.listen(5000, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${5000}`);
});