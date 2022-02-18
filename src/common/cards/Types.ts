import {Tags} from './Tags';

export interface ICardDiscount {
  tag?: Tags, // When absent, discount applies to all cards.
  amount: number
 }
