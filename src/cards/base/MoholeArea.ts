import {TileType} from '../../TileType';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {SpaceType} from '../../SpaceType';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {digit} from '../Options';

export class MoholeArea extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.MOHOLE_AREA,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '142',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.heat(4, {digit})).br;
        b.tile(TileType.MOHOLE_AREA, true);
      }),
      description: 'Increase your heat production 4 steps. Place this tile ON AN AREA RESERVED FOR OCEAN.',
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.BUILDING],
      cost: 20,
      adjacencyBonus,
      metadata,
      productionBox: Units.of({heat: 4}),
    });
  }

  public play(player: Player) {
    return new SelectSpace('Select an ocean space for special tile', player.game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
      player.game.addTile(player, SpaceType.OCEAN, space, {tileType: TileType.MOHOLE_AREA});
      space.adjacency = this.adjacencyBonus;
      player.addProduction(Resources.HEAT, 4);
      return undefined;
    });
  }
}
