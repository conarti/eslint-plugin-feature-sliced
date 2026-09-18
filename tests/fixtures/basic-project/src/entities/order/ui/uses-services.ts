/* Invalid: the import stays inside the order slice, so it has to be written as a relative path */
import { orderService } from 'src/entities/order/services/order-service';

export const orderView = orderService;
