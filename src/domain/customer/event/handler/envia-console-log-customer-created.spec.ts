import EventDispatcher from '../../../@shared/event/event-dispatcher';
import Customer from '../../entity/customer';
import CustomerCreatedEvent from '../customer-created.event';
import EnviaConsoleLog1Handler from './envia-console-log-1.handler';
import EnviaConsoleLog2Handler from './envia-console-log-2.handler';

describe('EnviaConsoleLog1Handler and EnviaConsoleLog2Handler tests', () => {
    it('should notify all event handlers when a customer is created', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, 'handle');
        const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle');

        eventDispatcher.register('CustomerCreatedEvent', eventHandler1);
        eventDispatcher.register('CustomerCreatedEvent', eventHandler2);

        expect(
            eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0],
        ).toMatchObject(eventHandler1);
        expect(
            eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1],
        ).toMatchObject(eventHandler2);

        const customer = new Customer('1', 'Customer');
        const customerCreatedEvent = new CustomerCreatedEvent(customer);

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });
});
