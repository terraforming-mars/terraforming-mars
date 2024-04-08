import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Board} from '../../boards/Board';
import {IProjectCard} from '../IProjectCard';
import {message} from '../../logs/MessageBuilder';
import {Space} from '../../boards/Space';
import {SpaceType} from '../../../common/boards/SpaceType';
import {isHazardTileType} from '../../../common/AresTileType';

export class RedCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.RED_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 21,

      behavior: {
        production: {energy: -1, megacredits: 2},
      },

      requirements: {party: PartyName.REDS},
      victoryPoints: 'special',

      metadata: {
        cardNumber: 'PFT2',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1).megacredits(2));
        }),
        description: 'Requires that Reds are ruling or that you have 2 delegates there. ' +
          '-1 energy prod, +2 M€ prod. ' +
          'Place the special tile on Mars ADJACENT TO NO GREENERY. ' +
          'NO GREENERY MAY BE PLACED NEXT TO THIS TILE. 1 VP for every empty space (or hazard) next to this tile.',
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(),
      },
    });
  }

  private availableRedCitySpaces(player: IPlayer) {
    const board = player.game.board;
    const citySpaces = board.getAvailableSpacesForCity(player);
    return citySpaces.filter((space) => !board.getAdjacentSpaces(space).some(Board.isGreenerySpace));
  }
  public override bespokeCanPlay(player: IPlayer) {
    return this.availableRedCitySpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace(
      message('Select space for ${0}', (b) => b.card(this)),
      this.availableRedCitySpaces(player))
      .andThen((space) => {
        player.game.addTile(player, space, {tileType: TileType.RED_CITY, card: this.name});
        return undefined;
      });
  }

  public override getVictoryPoints(player: IPlayer): number {
    const space = player.game.board.getSpaceByTileCard(this.name);
    if (space === undefined) {
      return 0;
    }

    const neighbors = player.game.board.getAdjacentSpaces(space);
    return neighbors.filter((neighbor) => this.isEmpty(neighbor)).length;
  }

  private isEmpty(space: Space): boolean {
    return space.spaceType === SpaceType.RESTRICTED || space.tile === undefined || isHazardTileType(space.tile.tileType);
  }
}
