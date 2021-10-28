import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../Tags';

export class RichDeposits extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RICH_DEPOSITS,
      cost: 12,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: 'Pf52',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.steel(3))),
        description: 'Requires 2 science tags. Increase your steel production 3 steps.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 3);
    return undefined;
  }
}

