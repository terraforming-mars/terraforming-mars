
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

export class Bushes extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BUSHES,
      tags: [Tags.PLANT],
      cost: 10,

      metadata: {
        cardNumber: '093',
        description: 'Requires -10 C or warmer. Increase your plant production 2 steps. Gain 2 plants.',
        requirements: CardRequirements.builder((b) => b.temperature(-10)),
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => {
            pb.plants(2);
          }).plants(2);
        }),
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -10);
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 2);
    player.plants += 2;
    return undefined;
  }
}
