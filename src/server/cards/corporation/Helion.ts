import {Card} from '../Card';
import {ICorporationCard} from './ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {multiplier} from '../Options';

export class Helion extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.HELION,
      tags: [Tag.SPACE],
      startingMegaCredits: 42,

      behavior: {
        production: {heat: 3},
      },

      metadata: {
        cardNumber: 'R18',
        description: 'You start with 3 heat production and 42 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.heat(3)).nbsp.megacredits(42);
          b.corpBox('effect', (ce) => {
            ce.effect('You may use heat as M€. You may not use M€ as heat.', (eb) => {
              eb.startEffect.text('x').heat(1).equals().megacredits(0, {multiplier});
            });
          });
        }),
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.canUseHeatAsMegaCredits = true;
    return undefined;
  }
}
