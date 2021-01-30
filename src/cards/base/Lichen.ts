import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class Lichen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LICHEN,
      tags: [Tags.PLANT],
      cost: 7,

      metadata: {
        cardNumber: '159',
        requirements: CardRequirements.builder((b) => b.temperature(-24)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1));
        }),
        description: 'Requires -24 C or warmer. Increase your Plant production 1 step.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -24);
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS);
    return undefined;
  }
}

