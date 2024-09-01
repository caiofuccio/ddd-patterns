import EventDispatcher from '../../../@shared/event/event-dispatcher';
import Customer from '../../entity/customer';
import Address from '../../value-object/address';
import CustomerAddressChangedEvent from '../customer-address-changed.event';
import CustomerCreatedEvent from '../customer-created.event';
import EnviaConsoleLogHandler from './envia-console-log.handler';

describe('EnviaConsoleLogHandler tests', () => {
    it('should notify all event handlers when a customer address is changed', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');

        eventDispatcher.register('CustomerAddressChangedEvent', eventHandler);

        expect(
            eventDispatcher.getEventHandlers['CustomerAddressChangedEvent'][0],
        ).toMatchObject(eventHandler);

        const customer = new Customer('1', 'Customer');
        new CustomerCreatedEvent(customer);

        const address = new Address('Street', 1, '12345678', 'City');
        customer.changeAddress(address);
        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: customer.id,
            name: customer.name,
            address: address.toString(),
        });

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});
