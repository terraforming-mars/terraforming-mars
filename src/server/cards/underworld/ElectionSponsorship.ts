import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {digit} from '../Options';
import {ICard} from '../ICard';

export class ElectionSponsorship extends PreludeCard implements ICard {
  public isDisabled: boolean = false;

  constructor() {
    super({
      name: CardName.ELECTION_SPONSORSHIP,
      tags: [Tag.MARS],

      behavior: {
        underworld: {corruption: 1},
        turmoil: {sendDelegates: {count: 1}},
      },

      metadata: {
        cardNumber: 'UP14',
        renderData: CardRenderer.builder((b) => {
          b.corruption().delegates(1).br;
          b.plainText('Gain 1 corruption. Place 1 delegate in any party.').br;

          b.effect('For the first 4 generations, gain +2 influence',
            (eb) => eb.text('Gen 1-4').startEffect.plus().influence({amount: 2, digit}).asterix());
        }),
      },
    });
  }

  public getInfluenceBonus(player: IPlayer) {
    if (player.game.generation <= 4) {
      return 2;
    }
    return 0;
  }
}
