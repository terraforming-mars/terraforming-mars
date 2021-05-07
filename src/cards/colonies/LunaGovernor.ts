import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class LunaGovernor extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 4,
      tags: [Tags.EARTH, Tags.EARTH],
      name: CardName.LUNA_GOVERNOR,
      cardType: CardType.AUTOMATED,

      requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 3)),
      metadata: {
        cardNumber: 'C20',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires 3 Earth tags. Increase your M€ production 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
