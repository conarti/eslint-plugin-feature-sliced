/* Violation: absolute-relative "must-be-relative-path" - the custom "services" segment is part of the "cart" slice */
import { cartService } from 'src2/entities/cart/services';

export const cartSubtotal = cartService.total;
