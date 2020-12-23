import {TileType} from '../../TileType';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {SpaceType} from '../../SpaceType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Tags} from '../Tags';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeArea implements IProjectCard {
    public cost = 20;
    public tags = [Tags.STEEL];
    public name = CardName.MOHOLE_AREA;
    public cardType = CardType.AUTOMATED;
    public adjacencyBonus?: IAdjacencyBonus = undefined;

    public play(player: Player, game: Game) {
      return new SelectSpace('Select an ocean space for special tile', game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
        game.addTile(player, SpaceType.OCEAN, space, {tileType: TileType.MOHOLE_AREA});
        space.adjacency = this.adjacencyBonus;
        player.addProduction(Resources.HEAT, 4);
        return undefined;
      });
    }
    public metadata: CardMetadata = {
      cardNumber: '142',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.heat(4).digit).br;
        b.tile(TileType.MOHOLE_AREA, true);
      }),
      description: 'Increase your heat production 4 steps. Place this tile ON AN AREA RESERVED FOR OCEAN.',
    }
}
