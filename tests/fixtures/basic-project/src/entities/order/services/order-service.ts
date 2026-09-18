/*
 * Valid: services and helpers are two folders of the order slice, which carries a public api.
 * The second import is valid only under the never-mix rule: this file resolves to the order
 * slice, while entities/services carries no public api and falls back to the slice name
 * "services", which is also this file's own fallback. Comparing one resolved side against one
 * fallback side would make the two look like different slices and report.
 */
import { serviceRegistry } from '../../services/model/service-registry';
import { orderHelper } from '../helpers/order-helper';

export const orderService = `order-${orderHelper}-${serviceRegistry}`;
