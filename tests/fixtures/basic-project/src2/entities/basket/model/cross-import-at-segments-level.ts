/* Valid: the "@x" cross-import stays exempt from the unknown-segment check at publicApi.level 'segments' */
import { cartService } from 'src2/entities/cart/@x/basket';

export const basketService = cartService;
