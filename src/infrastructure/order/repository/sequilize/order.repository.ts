import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export default class OrderRepository {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            },
        );
    }

    async update(entity: Order): Promise<void> {
        entity.items.forEach(async (item) => {
            await OrderItemModel.update(
                {
                    product_id: item.productId,
                    order_id: entity.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                },
                { where: { id: item.id } },
            );
        });

        await OrderModel.update(
            {
                total: entity.total(),
            },
            { where: { id: entity.id } },
        );
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: ['items'],
        });

        return new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map(
                (orderItemModel) =>
                    new OrderItem(
                        orderItemModel.id,
                        orderItemModel.name,
                        orderItemModel.price,
                        orderItemModel.product_id,
                        orderItemModel.quantity,
                    ),
            ),
        );
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: ['items'],
        });

        return orderModels.map(
            (orderModel) =>
                new Order(
                    orderModel.id,
                    orderModel.customer_id,
                    orderModel.items.map(
                        (orderModelItem) =>
                            new OrderItem(
                                orderModelItem.id,
                                orderModelItem.name,
                                orderModelItem.price,
                                orderModelItem.product_id,
                                orderModelItem.quantity,
                            ),
                    ),
                ),
        );
    }
}
