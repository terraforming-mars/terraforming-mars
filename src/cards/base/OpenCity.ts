import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class OpenCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.OPEN_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 23,
      productionBox: Units.of({energy: -1, megacredits: 4}),

      requirements: CardRequirements.builder((b) => b.oxygen(12)),
      metadata: {
        cardNumber: '108',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(4);
          }).city().plants(2);
        }),
        description: {
          text: 'Requires 12% oxygen. Gain 2 plants. Place a City tile. Decrease your Energy production 1 step and increase your M€ production 4 steps.',
          align: 'left',
        },
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    return super.canPlay(player) && player.getProduction(Resources.ENERGY) >= 1 && player.game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public play(player: Player) {
    return new SelectSpace('Select space for city tile', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.MEGACREDITS, 4);
      player.plants += 2;
      return undefined;
    });
  }
  public getVictoryPoints() {
    return 1;
  }
}
