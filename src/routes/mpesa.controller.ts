import { Request, Response } from "express";
import MpesaDarajaApi from "../repository/mpesa";

type TokenGenrator = () => Promise<string>;

export default class Payments {
  public mpesa: MpesaDarajaApi;
  private readonly genToken: TokenGenrator;
  constructor(mpesa: MpesaDarajaApi, genToken: TokenGenrator) {
    this.mpesa = mpesa;
    this.genToken = genToken;
  }

  stkPush = async (req: Request, res: Response) => {
    const token = await this.genToken();
    if (token) {
      const results = await this.mpesa.stkPush(token, req.body);
      res.json(results);
    } else {
      res.json({ msg: "invalid token 👺👺" });
    }
  };
  /**
   * @description generates a base64Encoded password
   * @param req http request handler
   * @param res http response handler
   */
  public createPass = (req: Request, res: Response) => {
    const result = this.mpesa.genPassword();
    res.json(result).status(200);
  };

  conirmationWebHook = (req: Request, res: Response) => {
    console.log("-----------Received M-Pesa webhook-----------");
    console.log(req.body);
    console.log("-----------------------");
    let message = {
      ResponseCode: "00000000",
      ResponseDesc: "success",
    };
    // respond to safaricom servers with a success message
    res.json(message);
  };
}