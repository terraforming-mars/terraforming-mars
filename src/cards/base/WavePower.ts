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

export class WavePower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.WAVE_POWER,
      tags: [Tags.ENERGY],
      cost: 8,

      metadata: {
        cardNumber: '139',
        requirements: CardRequirements.builder((b) => b.oceans(3)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Requires 3 ocean tiles. Increase your energy production 1 step.',
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.OCEANS, 3);
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}

