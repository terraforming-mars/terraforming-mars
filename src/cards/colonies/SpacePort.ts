import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {Units} from '../../Units';

export class SpacePort extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 22,
      tags: [Tags.CITY, Tags.BUILDING],
      name: CardName.SPACE_PORT,
      cardType: CardType.AUTOMATED,
      productionBox: Units.of({energy: -1, megacredits: 4}),

      requirements: CardRequirements.builder((b) => b.colonies()),
      metadata: {
        cardNumber: 'C39',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(4);
          }).nbsp.city().br;
          b.tradeFleet();
        }),
        description: 'Requires 1 colony. Decrease your Energy production 1 step and increase your M€ production 4 steps. Place a City tile. Gain 1 Trade Fleet.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.board.getAvailableSpacesForCity(player).length === 0) return false;
    let coloniesCount: number = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
    });
    return coloniesCount > 0 && player.getProduction(Resources.ENERGY) > 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 4);
    player.addProduction(Resources.ENERGY, -1);
    player.increaseFleetSize();

    return new SelectSpace('Select space for city tile', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      return undefined;
    });
  }
}
