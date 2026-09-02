import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';

export class HighCircles extends PreludeCard implements ICard {
  public isDisabled: boolean = false;

  constructor() {
    super({
      name: CardName.HIGH_CIRCLES,
      tags: [Tag.EARTH],

      behavior: {
        tr: 1,
        turmoil: {influenceBonus: 1, sendDelegates: {count: 2}},
      },

      metadata: {
        cardNumber: 'P51',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).cards(1).asterix().delegates(2).br;
          b.plainText('Raise your TR 1 step and draw 1 card with PARTY REQUIREMENT. Place 2 delegates in one party.').br;

          b.effect('You have +1 influence.',
            (eb) => eb.startEffect.plus().influence({amount: 1}));
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.drawCard(1, {include: ((card) => card.requirements?.some((req) => req.party !== undefined))});
    return undefined;
  }
}
