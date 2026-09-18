/* Invalid: both slices carry a public api, so "helpers" is the segment by position and is not a configured one */
import { invoiceHelper } from 'src2/entities/invoice/helpers/invoice-helper';

export const payment = invoiceHelper;
