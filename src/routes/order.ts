import { Router } from 'express';
import { OrdersRepository } from '../repository/orders';
// import { UserRepository } from '../repository/user.repository';


const orderRoutes = Router();
const repo = new OrdersRepository();
// const userRepo = new UserRepository();

orderRoutes.post('/',async (req:any,res)=>{
    // const customer = await userRepo.fetchUser(req.UserId);
    const newOrder = await repo.createOrder({...req.body,customerId:req.UserId,status:'received',});
    res.status(201).json({message:"new order created",id: newOrder.id})
})

orderRoutes.put('/',async (req,res)=>{
    const newOrder = await repo.updateOrder(req.body);
    res.status(200).json({message:"order updated",id: newOrder.id})
})

orderRoutes.get('/',async (req:any,res)=>{
    const orders = await repo.fetchOrders(parseInt(req.UserId));
    res.status(200).json({message:"order History",orders})
})

export default orderRoutes;
