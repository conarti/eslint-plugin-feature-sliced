/* Invalid: services is a segment of the order slice, so it may only be reached through the slice public api */
import { orderService } from 'src/entities/order/services/order-service';

export const homeOrder = orderService;
