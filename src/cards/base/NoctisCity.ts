import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
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
      productionDelta: Units.of({energy: -1, megacredits: 3}),

      metadata: {
        cardNumber: '017',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.city();
        }),
        description: 'Decrease your Energy production 1 step and increase your MC production 3 steps. Place a City ON THE RESERVED AREA, disregarding normal placement restrictions.',
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    if (game.gameOptions.boardName === BoardName.ORIGINAL) {
      return player.getProduction(Resources.ENERGY) >= 1;
    } else {
      return player.getProduction(Resources.ENERGY) >= 1 &&
            game.board.getAvailableSpacesForCity(player).length > 0; ;
    }
  }
  public play(player: Player, game: Game) {
    const noctisSpace = game.board.getSpace(SpaceName.NOCTIS_CITY);
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 3);
    if (game.gameOptions.boardName === BoardName.ORIGINAL) {
      game.addCityTile(player, noctisSpace.id);
      return undefined;
    } else {
      return new SelectSpace('Select space for Noctis city', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        game.addCityTile(player, space.id);
        return undefined;
      });
    }
  }
}
