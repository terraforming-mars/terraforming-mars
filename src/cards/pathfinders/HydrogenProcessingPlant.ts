import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {Resources} from '../../Resources';

export class HydrogenProcessingPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HYDROGEN_PROCESSING_PLANT,
      cost: 9,
      tags: [Tags.BUILDING, Tags.ENERGY],
      requirements: CardRequirements.builder((b) => b.oxygen(3)),
      victoryPoints: -1,

      metadata: {
        cardNumber: 'Pf19',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).slash().oceans(2).br;
          b.minus().oxygen(1).br;
        }),
        description: 'Oxygen level must be 3% or higher. Decrease oxygen level 1% ' +
          'Raise your energy production 1 step for every two ocean tiles on Mars.',
      },
    });
  }

  public produce(player: Player) {
    player.addProduction(Resources.ENERGY, Math.floor(player.game.board.getOceansOnBoard() / 2), {log: true});
  }

  public play(player: Player) {
    player.game.increaseOxygenLevel(player, -1);
    this.produce(player);
    return undefined;
  }
}

