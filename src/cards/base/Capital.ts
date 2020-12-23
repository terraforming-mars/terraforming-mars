import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {TileType} from '../../TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {Board} from '../../boards/Board';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Capital implements IProjectCard {
    public cost = 26;
    public tags = [Tags.CITY, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.CAPITAL;
    public adjacencyBonus?: IAdjacencyBonus = undefined;

    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 2 &&
        game.board.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game) &&
        game.board.getAvailableSpacesForCity(player).length > 0;
    }
    public getVictoryPoints(_player: Player, game: Game) {
      const usedSpace = game.board.getSpaceByTileCard(this.name);
      if (usedSpace !== undefined) {
        return game.board.getAdjacentSpaces(usedSpace)
          .filter((s) => Board.isOceanSpace(s)).length;
      }
      return 0;
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -2);
      player.addProduction(Resources.MEGACREDITS, 5);
      return new SelectSpace(
        'Select space for special city tile',
        game.board.getAvailableSpacesForCity(player),
        (space: ISpace) => {
          game.addTile(player, SpaceType.LAND, space, {
            tileType: TileType.CAPITAL,
            card: this.name,
          });
          space.adjacency = this.adjacencyBonus;
          return undefined;
        },
      );
    }
    public metadata: CardMetadata = {
      cardNumber: '008',
      description: {
        text: 'Requires 4 ocean tiles. Place this tile. Decrease your Energy production 2 steps and increase your MC production 5 steps.',
        align: 'left',
      },
      requirements: CardRequirements.builder((b) => b.oceans(4)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(2).br;
          pb.plus().megacredits(5);
        }).nbsp.tile(TileType.CAPITAL, false).br;
        b.text('1 additional VP for each ocean tile adjacent to this city tile', CardRenderItemSize.TINY, true);
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.oceans(1, 1),
    }
}
