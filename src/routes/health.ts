import  { Router,Response } from "express";

const healthCheck = Router();

healthCheck.get('/', async (_, res:Response) => {
	res.status(200).send('OK');
});

export default healthCheck;