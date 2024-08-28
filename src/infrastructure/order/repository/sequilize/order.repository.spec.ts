import { Sequelize } from 'sequelize-typescript';
import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import Customer from '../../../../domain/customer/entity/customer';
import Address from '../../../../domain/customer/value-object/address';
import Product from '../../../../domain/product/entity/product';
import CustomerModel from '../../../customer/repository/sequelize/customer.model';
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository';
import ProductModel from '../../../product/repository/sequelize/product.model';
import ProductRepository from '../../../product/repository/sequelize/product.repository';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';
import OrderRepository from './order.repository';

describe('Order repository test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);

        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2,
        );

        const order = new Order('123', '123', [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: '123',
            customer_id: '123',
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: '123',
                    product_id: '123',
                },
            ],
        });
    });

    it('should update an existing order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2,
        );

        const order = new Order('123', '123', [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        orderItem.changeName('Product 2');
        orderItem.changeQuantity(3);
        orderItem.changePrice(20);
        order.changeTotal(order.total());
        order.changeItems([orderItem]);

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: orderItem.productId,
                },
            ],
        });
    });

    it('should find an existing order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2,
        );

        const order = new Order('123', '123', [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await orderRepository.find(order.id);

        expect(orderModel).toStrictEqual(order);
    });

    it('should find all existing orders', async () => {
        const customerRepository = new CustomerRepository();
        const customerOne = new Customer('123', 'Customer 1');
        const addressOne = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customerOne.changeAddress(addressOne);
        await customerRepository.create(customerOne);

        const productRepository = new ProductRepository();
        const productOne = new Product('123', 'Product 1', 10);
        await productRepository.create(productOne);

        const orderItemOne = new OrderItem(
            '1',
            productOne.name,
            productOne.price,
            productOne.id,
            2,
        );

        const orderOne = new Order('123', '123', [orderItemOne]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(orderOne);

        const customerTwo = new Customer('456', 'Customer 2');
        const addressTwo = new Address('Street 2', 2, 'Zipcode 2', 'City 2');
        customerTwo.changeAddress(addressTwo);
        await customerRepository.create(customerTwo);

        const productTwo = new Product('456', 'Product 2', 20);
        await productRepository.create(productTwo);

        const orderItemTwo = new OrderItem(
            '2',
            productTwo.name,
            productTwo.price,
            productTwo.id,
            1,
        );

        const orderTwo = new Order('456', '456', [orderItemTwo]);
        await orderRepository.create(orderTwo);

        const orders = [orderOne, orderTwo];

        const orderModels = await orderRepository.findAll();

        expect(orderModels).toStrictEqual(orders);
    });
});
