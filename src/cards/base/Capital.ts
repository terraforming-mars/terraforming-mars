import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {TileType} from '../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../common/boards/SpaceType';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {Board} from '../../boards/Board';
import {ICardMetadata} from '../../common/cards/ICardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Units} from '../../common/Units';

export class Capital extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.CAPITAL,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: ICardMetadata = {
      cardNumber: '008',
      description: {
        text: 'Requires 4 ocean tiles. Place this tile. Decrease your Energy production 2 steps and increase your M€ production 5 steps.',
        align: 'left',
      },
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
      productionBox: Units.of({energy: -2, megacredits: 5}),

      requirements: CardRequirements.builder((b) => b.oceans(4)),
      victoryPoints: 'special',
      metadata,
    });
  }
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 2 &&
        player.game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public override getVictoryPoints(player: Player) {
    const usedSpace = player.game.board.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      return player.game.board.getAdjacentSpaces(usedSpace)
        .filter((s) => Board.isOceanSpace(s)).length;
    }
    return 0;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -2);
    player.addProduction(Resources.MEGACREDITS, 5);
    return new SelectSpace(
      'Select space for special city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        player.game.addTile(player, SpaceType.LAND, space, {
          tileType: TileType.CAPITAL,
          card: this.name,
        });
        space.adjacency = this.adjacencyBonus;
        return undefined;
      },
    );
  }
}
