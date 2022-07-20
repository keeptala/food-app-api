import * as paypal from 'paypal-rest-sdk';
import { Request, Response } from 'express';

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENTID,
  client_secret: process.env.PAYPAL_SECRET,
});

export const initiatePayment = (req: Request, res: Response) => {
  try {
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url:
          'localhost:5000/api/v1/payment/success',
        cancel_url:
          'localhost:5000/api/v1/payment/cancel',
      },
      transactions: [
        {
          item_list: {
            items: req.body.items || [
              {
                name: 'pizza',
                sku: 'item',
                price: '1.00',
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: '1.00',
          },
          description: 'order payment description',
        },
      ],
    };

    paypal.payment.create(create_payment_json, (err, payment) => {
      if (err) {
        res
          .status(500)
          .json({
            message: `Error occured while initiating payment: ${err.message}`,
          });
        console.log(`Error @ the initiate payment handler: ${err.message}`);
        throw err;
      } else {
        payment.links.forEach((link) => {
          if (link.rel === 'approval_url') {
            res
              .status(200)
              .json({
                message: 'Payment process initiated',
                redirect_url: link.href,
              });
          }
        });
        console.log(payment);
      }
    });
  } catch (e) {
    console.log(`Error @ the initiate payment handler: ${e.message}`);
  }
};

export const paymentSuccess = async (req: Request, res: Response) => {
  try {
    const payerId = req.query.PayerID as string;
    const paymentId = req.query.paymentId as string;

    const execute_payment_json: paypal.payment.ExecuteRequest = {
      payer_id: payerId,
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          res
            .status(500)
            .json({ message: `Error execting payment: ${error.message}` });
          console.log(`Error @ the success route handler: ${error.message}`);
          throw error;
        } else {
          res.status(200).json({ message: 'payment successfull', payment });
        }
      },
    );
  } catch (e) {
    console.log(`Error on the success handler: ${e.message}`);
  }
};

export const paymentCancel = (_: any, res: Response) => {
  res.status(200).json({ message: `Transaction cancelled` });
};
