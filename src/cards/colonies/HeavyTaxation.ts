import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class HeavyTaxation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      tags: [Tags.EARTH],
      name: CardName.HEAVY_TAXATION,
      cardType: CardType.AUTOMATED,
      victoryPoints: -1,

      requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 2)),
      metadata: {
        cardNumber: 'C14',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp.megacredits(4);
        }),
        description: 'Requires 2 Earth tags. Increase your M€ production 2 steps, and gain 4 M€.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.megaCredits += 4;
    return undefined;
  }
}
