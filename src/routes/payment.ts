import {Router} from 'express'
import { initiatePayment, paymentCancel, paymentSuccess } from '../service/payment';

const payment = Router()

payment.post('/paypal',initiatePayment);
payment.get('/success',paymentSuccess);
payment.get('/cancel',paymentCancel)

export default payment;