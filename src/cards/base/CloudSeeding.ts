import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class CloudSeeding extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CLOUD_SEEDING,
      cost: 11,

      metadata: {
        cardNumber: '004',
        description: 'Requires 3 ocean tiles. Decrease your MC production 1 step and any heat production 1 step. Increase your Plant production 2 steps.',
        requirements: CardRequirements.builder((b) => b.oceans(3)),
        renderData: CardRenderer.builder((b) => b.productionBox((pb) => {
          pb.minus().megacredits(1).heat(1).any.br;
          pb.plus().plants(2);
        })),
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return player.getProduction(Resources.MEGACREDITS) > -5 &&
        game.checkMinRequirements(player, GlobalParameter.OCEANS, 3) &&
        game.someoneHasResourceProduction(Resources.HEAT, 1);
  }

  public play(player: Player, game: Game) {
    game.defer(new DecreaseAnyProduction(player, game, Resources.HEAT, 1));
    player.addProduction(Resources.MEGACREDITS, -1);
    player.addProduction(Resources.PLANTS, 2);
    return undefined;
  }
}
