import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {TileType} from '../../TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {Board} from '../../boards/Board';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class Capital extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.CAPITAL,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      cardNumber: '008',
      description: {
        text: 'Requires 4 ocean tiles. Place this tile. Decrease your Energy production 2 steps and increase your MC production 5 steps.',
        align: 'left',
      },
      requirements: CardRequirements.builder((b) => b.oceans(4)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(2).br;
          pb.plus().megacredits(5);
        }).nbsp.tile(TileType.CAPITAL, false).br;
        b.vpText('1 additional VP for each ocean tile adjacent to this city tile.');
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.oceans(1, 1),
    },
  ) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 26,
      adjacencyBonus,

      metadata,
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return player.getProduction(Resources.ENERGY) >= 2 &&
        game.checkMinRequirements(player, GlobalParameter.OCEANS, 4) &&
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
}
