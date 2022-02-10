import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../common/turmoil/PartyName';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {TileType} from '../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {AresHandler} from '../../ares/AresHandler';
import {Board} from '../../boards/Board';

export class RedCity extends Card {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RED_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 21,
      productionBox: Units.of({energy: -1, megacredits: 2}),
      requirements: CardRequirements.builder((b) => b.party(PartyName.REDS)),
      victoryPoints: 'special',

      metadata: {
        cardNumber: 'PFT2',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1).megacredits(2));
        }),
        description: 'Requires that Reds are ruling or that you have 2 delegates there. ' +
          '-1 energy prod, +2 M€ prod. ' +
          'Place the special tile on Mars ADJACENT TO NO GREENERY. ' +
          'NO GREENERY MAY BE PLACED NEXT TO THIS TILE. 1 VP for every empty space next to this tile (Ares hazards don\'t count.)',
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(),
      },
    });
  }

  private availableRedCitySpaces(player: Player) {
    const board = player.game.board;
    const citySpaces = board.getAvailableSpacesForCity(player);
    return citySpaces.filter((space) => !board.getAdjacentSpaces(space).some(Board.isGreenerySpace));
  }
  public override canPlay(player: Player) {
    return player.canAdjustProduction(this.productionBox) && this.availableRedCitySpaces(player).length > 0;
  }

  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    return new SelectSpace('Select space for Red City', this.availableRedCitySpaces(player), (space) => {
      player.game.addTile(player, space.spaceType, space, {tileType: TileType.RED_CITY, card: this.name});
      return undefined;
    });
  }

  public override getVictoryPoints(player: Player): number {
    const space = player.game.board.getSpaceByTileCard(this.name);
    if (space === undefined) {
      return 0;
    }

    const neighbors = player.game.board.getAdjacentSpaces(space);
    return neighbors.filter((neighbor) => neighbor.tile === undefined || AresHandler.hasHazardTile(neighbor)).length;
  }
}
