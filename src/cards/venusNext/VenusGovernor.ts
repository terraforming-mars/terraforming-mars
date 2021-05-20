import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class VenusGovernor extends Card {
  constructor() {
    super({
      name: CardName.VENUS_GOVERNOR,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS, Tags.VENUS],
      cost: 4,

      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS, 2)),
      metadata: {
        cardNumber: '255',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires 2 Venus tags. Increase your M€ production 2 steps.',
      },
    });
  };
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
