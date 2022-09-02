import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../../common/GlobalParameter';

export class MorningStarInc extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.MORNING_STAR_INC,
      tags: [Tag.VENUS],
      startingMegaCredits: 50,
      cardType: CardType.CORPORATION,
      initialActionText: 'Draw 3 Venus-tag cards',

      metadata: {
        cardNumber: 'R06',
        description: 'You start with 50 M€. As your first action, reveal cards from the deck until you have revealed 3 Venus-tag cards. Take those into hand and discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(50).nbsp.cards(3, {secondaryTag: Tag.VENUS});
          b.corpBox('effect', (ce) => {
            ce.effect('Your Venus requirements are +/- 2 steps, your choice in each case.', (eb) => {
              eb.plate('Venus requirements').startEffect.text('+/- 2');
            });
          });
        }),
      },
    });
  }

  public initialAction(player: Player) {
    player.drawCard(3, {tag: Tag.VENUS});
    return undefined;
  }

  public getRequirementBonus(_player: Player, parameter: GlobalParameter): number {
    return parameter === GlobalParameter.VENUS ? 2 : 0;
  }

  public play() {
    return undefined;
  }
}
