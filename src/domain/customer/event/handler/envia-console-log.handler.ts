import EventHandlerInterface from '../../../@shared/event/event-handler.interface';
import CustomerAddressChangedEvent from '../customer-address-changed.event';
import CustomerCreatedEvent from '../customer-created.event';

export default class EnviaConsoleLogHandler
    implements EventHandlerInterface<CustomerAddressChangedEvent>
{
    handle(event: CustomerAddressChangedEvent): void {
        const { id, name, address } = event.eventData;
        console.log(
            `Endereço do cliente: ${id}, ${name} alterado para: ${address}`,
        );
    }
}
