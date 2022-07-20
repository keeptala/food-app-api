import { orderItems, orders, orderStatus, PrismaClient } from '@prisma/client';

export interface IOrdersRepository {
  createOrder(order: NewOrderInput): Promise<orders>;
  fetchOrders(id: number): Promise<Array<orders>>;
  updateOrder(order: orders): Promise<orders>;
}

const prisma = new PrismaClient();

export class OrdersRepository implements IOrdersRepository {
  async createOrder(order: NewOrderInput): Promise<orders> {
    const orders = await prisma.orders.create({
      data: {
        customerId: order.customerId,
        status: order.status,
      },
    });

    const items = order.orderItems.map((e) => {
      return {
        orderId: orders.id,
        productId: parseInt(e.productId.toString()),
        quantity: parseInt(e.quantity.toString()),
      };
    });

    await prisma.orderItems.createMany({
      data: [...items],
    });
    return orders;
  }
  async fetchOrders(id: number): Promise<orders[]> {
    const orders = await prisma.orders.findMany({
      where: {
        customerId: {
          equals: parseInt(id.toString()),
        },
      },
    });
    return orders;
  }
  async updateOrder(order: orders): Promise<orders> {
    const result = await prisma.orders.update({
      data: order,
      where: {
        id: parseInt(order.id.toString()),
      },
    });
    return result;
  }
}

type NewOrderInput = {
  customerId: number;
  status: orderStatus;
  orderItems: orderItems[];
};
