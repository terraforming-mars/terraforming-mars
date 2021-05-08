import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {BoardName} from '../../boards/BoardName';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class NoctisCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NOCTIS_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 18,
      productionBox: Units.of({energy: -1, megacredits: 3}),

      metadata: {
        cardNumber: '017',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.city().asterix();
        }),
        description: 'Decrease your Energy production 1 step and increase your M€ production 3 steps. Place a City tile ON THE RESERVED AREA, disregarding normal placement restrictions.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.gameOptions.boardName === BoardName.ORIGINAL) {
      return player.getProduction(Resources.ENERGY) >= 1;
    } else {
      return player.getProduction(Resources.ENERGY) >= 1 &&
            player.game.board.getAvailableSpacesForCity(player).length > 0; ;
    }
  }
  public play(player: Player) {
    const noctisSpace = player.game.board.getSpace(SpaceName.NOCTIS_CITY);
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 3);
    if (player.game.gameOptions.boardName === BoardName.ORIGINAL) {
      player.game.addCityTile(player, noctisSpace.id);
      return undefined;
    } else {
      return new SelectSpace('Select space for Noctis city', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        player.game.addCityTile(player, space.id);
        return undefined;
      });
    }
  }
}
