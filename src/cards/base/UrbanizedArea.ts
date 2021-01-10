import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';

export class UrbanizedArea extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.URBANIZED_AREA,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 10,
      hasRequirements: false,

      metadata: {
        cardNumber: '120',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(2);
          }).city().asterix();
        }),
        description: 'Decrease your Energy production 1 step and increase your MC production 2 steps. Place a city tile ADJACENT TO AT LEAST 2 OTHER CITY TILES.',
      },
    });
  }
  private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
    return game.board.getAvailableSpacesOnLand(player)
      .filter((space) => game.board.getAdjacentSpaces(space).filter((adjacentSpace) => Board.isCitySpace(adjacentSpace)).length >= 2);
  }
  public canPlay(player: Player, game: Game): boolean {
    return player.getProduction(Resources.ENERGY) >= 1 && this.getAvailableSpaces(player, game).length > 0;
  }
  public play(player: Player, game: Game) {
    return new SelectSpace('Select space next to at least 2 other city tiles', this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
      game.addCityTile(player, foundSpace.id);
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    });
  }
}
