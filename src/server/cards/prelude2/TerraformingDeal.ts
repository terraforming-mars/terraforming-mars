
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Phase} from '../../../common/Phase';
import {Resource} from '../../../common/Resource';
import {PreludeCard} from '../prelude/PreludeCard';

export class TerraformingDeal extends PreludeCard {
  constructor() {
    super({
      name: CardName.TERRAFORMING_DEAL,
      tags: [Tag.EARTH],

      metadata: {
        cardNumber: 'P64',
        renderData: CardRenderer.builder((b) => {
          b.effect('Each step your TR is raised, you gain 2 M€.', (eb) => {
            eb.tr(1).startEffect.megacredits(2);
          });
        }),
      },
    });
  }

  // TODO(kberg): Like UNMO, TerraformingDeal can generate MC for raising TR that MC can offset reds costs?
  public onIncreaseTerraformRating(player: IPlayer, cardOwner: IPlayer, steps: number) {
    if (cardOwner === player) {
      const phase = player.game.phase;
      if (phase === Phase.ACTION || phase === Phase.PRELUDES || player.game.inTurmoil) {
        cardOwner.stock.add(Resource.MEGACREDITS, 2 * steps, {log: true});
      }
    }
  }
}
