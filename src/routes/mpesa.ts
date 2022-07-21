import { Router } from "express";
import MpesaDarajaApi from "../repository/mpesa";
import { genToken } from "../utils/mpesa";

import Payments from "./mpesa.controller";


//class binding
const mpesa = new MpesaDarajaApi("api/v1/payments", process.env.HOST,process.env.Node_ENV);
const payments = new Payments(mpesa, genToken);
const PaymentRoutes = Router();
/**
 * @openapi
 * /api/v1/payments/password:
 *   get:
 *     description: generate safaricom password
 *     responses:
 *       200:
 *         description: Returns a password token.
 */
PaymentRoutes.get("/password", payments.createPass);

/**
 * @openapi
 * /api/v1/payments/stk/push:
 *   post:
 *     description: creates a stk push notification to the client
 *     responses:
 *       200:
 *         description: Returns a password token.
 */
PaymentRoutes.post("/stk/push", payments.stkPush);
/**
 * @openapi
 * /api/v1/payments/confirmation:
 *   post:
 *     description: create our webhook endpoint to receive webhooks from Safaricom
 *     responses:
 *       200:
 *         description: Returns confirmation response based on the transcations.
 */

PaymentRoutes.post("/confirmation", payments.conirmationWebHook);

export default PaymentRoutes;