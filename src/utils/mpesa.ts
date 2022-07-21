import axios from "axios";

const Node_ENV = process.env.NODE_ENV;
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecreate = process.env.CONSUMER_SECREATE;

/**
 * @returns acessToken fron safaricom daraja api
 */
export const genToken = async(
  
  mode = Node_ENV
) => {

  try {
    const url = `https://${
      mode !== "production" ? "sandbox" : "api"
    }.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`;
    const auth =
      "Basic " +
      Buffer.from(consumerKey + ":" + consumerSecreate).toString("base64");
    const headers = {
      Authorization: auth,
    };
    
    const result = await axios.get(url, { headers });
    const { access_token } = result.data;
    const token :string = access_token;
    return token
  } catch (e) {
    throw new Error("Error while generating token");
    
  }
};


