import {Tags} from './Tags';

export type CardDiscount = {
  tag?: Tags, // When absent, discount applies to all tags.
  amount: number,
  per?: 'card' | 'tag', // discount is either applied once for the card, or for every tag.
 }
