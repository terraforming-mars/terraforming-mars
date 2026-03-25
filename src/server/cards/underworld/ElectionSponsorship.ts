import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {ICard} from '../ICard';

export class ElectionSponsorship extends PreludeCard implements ICard {
  public isDisabled: boolean = false;

  constructor() {
    super({
      name: CardName.ELECTION_SPONSORSHIP,
      tags: [Tag.CRIME],

      behavior: {
        underworld: {corruption: 1},
        turmoil: {
          sendDelegates: {count: 2},
          influenceBonus: 1,
        },
      },

      metadata: {
        cardNumber: 'UP14',
        renderData: CardRenderer.builder((b) => {
          b.corruption().delegates(2).br;
          b.plainText('Gain 1 corruption. Place 2 delegates in any party.').br;

          b.effect('You have +1 influence.', (eb) => eb.startEffect.influence());
        }),
      },
    });
  }
}
