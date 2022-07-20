import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Router, Response } from 'express';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../service/user.service';
import { CreateAdminInput, CreateCustomerInput } from '../types';

const userService = new UserService(new UserRepository());
const userRoutes = Router();

userRoutes.get('/:id', async (req: any, res: Response) => {
  try {
    const response = await userService.fetchUserProfile(req.params.id);
    res
      .status(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

userRoutes.post('/login', async (req, res) => {
  const user = await userService.findUser(req.body);
 
  if (!user) {
    res.json({
      message: 'invalid credentials',
    });
  }
 
  // verify password
  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (validPass) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...rest } = user;
    // create and assign an authentification token
    const token = jwt.sign(rest, process.env.SECREATE_TOKEN);
    // generate access token
    res
      .status(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ token, message: 'user authenticated successfully' ,id:user.id});
  }
});

userRoutes.post('/customer/register', async (req, res) => {
  const response = await userService.registerNewUser<CreateCustomerInput>(
    req.body,
  );
  res
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(response);
});

userRoutes.post('/admin/register', async (req, res) => {
  const response = await userService.registerNewUser<CreateAdminInput>(
    req.body,true
  );
  res
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(response);
});

userRoutes.put('/', async (req, res) => {
  const response = await userService.resetPassword(req.body);
  res
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(response);
});

userRoutes.put('/deviceToken/:id/:token', async (req, res) => {
  const response = await userService.updateDeviceToken(
    req.params.token,
    req.params.id,
  );
  res
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(response);
});

export default userRoutes;
