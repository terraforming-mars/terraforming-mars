import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {CardName} from '@/common/cards/CardName';

export type DiscountSource = {
  /** The card that gives the discount. */
  source: CardName;
  /** The M€ discount. */
  amount: number;
  /** A short description of which cards the discount applies to. */
  appliesTo: string;
};

/**
 * Lists the project card discounts a player has that can't be described by a tag,
 * e.g. discounts for cards with requirements.
 */
export function getConditionalDiscounts(player: PublicPlayerModel): Array<DiscountSource> {
  const discounts: Array<DiscountSource> = [];

  for (const card of player.tableau) {
    switch (card.name) {
    case CardName.CUTTING_EDGE_TECHNOLOGY:
      discounts.push({source: card.name, amount: 2, appliesTo: 'cards with requirements'});
      break;
    case CardName.XAVIER:
      if (card.isDisabled) {
        discounts.push({source: card.name, amount: 1, appliesTo: 'cards with requirements'});
      }
      break;
    case CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS:
      const amount = Math.floor((card.resources ?? 0) / 2);
      if (amount > 0) {
        discounts.push({source: card.name, amount, appliesTo: 'space cards without planetary tags'});
      }
      break;
    }
  }

  return discounts;
}
