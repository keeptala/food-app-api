import axios from "axios";
import dateTime from "node-datetime";

const shortCode = process.env.SHORT_CODE
const passKey = process.env.PASSKEY

/**
 * @description formats date into YYYYMMDDHHMMS-date format
 */
export function formatDate(): string {
  const dt = dateTime.create();
  const formatedDate = dt.format("YmdHMS");
  return formatedDate;
}

/**
 *
 * @param formatedDate the formated date string
 */
export function newPassword(
  shortCode: string,
  passkey: string,
  formatedDate: string
): string {
  const passString = shortCode + passkey + formatedDate;
  const base64EncodedPass = Buffer.from(passString).toString("base64");
  return base64EncodedPass;
}

//"https://7db63514dbd1.ngrok.io/api/stk/push/callback/url"

type mpesaResponse = {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
};

interface RegisterReponse {
  ConversationID: string;
  OriginatorConversationID: string;
  ResponseDescription: string;
}

class MpesaDarajaApi {
  /**
   *
   * @param callbackUrl the POST url for successfull transcation
   * @param baseUrl application base url
   * @param env mode of operation i.e development or production
   */
  constructor(
    private readonly callbackUrl: string,
    private readonly baseUrl: string,
    private readonly env: string
  ) {}

  genPassword(): string {
    const formatedDate = formatDate();
    const base64EncodedPass = newPassword(shortCode, passKey, formatedDate);
    return base64EncodedPass;
  }

  /**
   * @description handles Lipa na Mpesa Online transcation
   * @param token jwt token issued
   * @param body the request body
   */
  stkPush = async (
    token: string,
    body: {
      amount: string;
      phoneNumber: string;
      accountRef: string;
      tranDesc: string;
    },
    mode = this.env
  ): Promise<mpesaResponse> => {
    const { amount, phoneNumber, accountRef, tranDesc } = body;
    const stkUrl = `https://${
      mode !== "production" ? "sandbox" : "api"
    }.safaricom.co.ke/mpesa/stkpush/v1/processrequest`;
    const auth = "Bearer " + token;
    const headers = {
      Authorization: auth,
    };

    const formattedDate = formatDate();
    const pass = newPassword(shortCode, passKey, formattedDate);
    //data to be sent to daraja api
    let data = {
      BusinessShortCode: shortCode,
      Password: pass,
      Timestamp: formattedDate,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${this.baseUrl}/${this.callbackUrl}/confirmation`,
      AccountReference: accountRef,
      TransactionDesc: tranDesc,
    };

    let response = await axios.post(stkUrl, data, { headers });
    return response.data;
  };
}

export default MpesaDarajaApi;