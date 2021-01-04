import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class Insects extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INSECTS,
      tags: [Tags.MICROBE],
      cost: 9,

      metadata: {
        cardNumber: '148',
        requirements: CardRequirements.builder((b) => b.oxygen(6)),
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.plants(1).slash().plants(1).played);
        }),
        description: 'Requires 6% oxygen. Increase your Plant production 1 step for each plant tag you have.',
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.OXYGEN, 6);
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, player.getTagCount(Tags.PLANT));
    return undefined;
  }
}
