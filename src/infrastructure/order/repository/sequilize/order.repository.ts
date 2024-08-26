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
}
