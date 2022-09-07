import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class MoholeArea extends Card implements IProjectCard {
  constructor(
    name = CardName.MOHOLE_AREA,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
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
      tags: [Tag.BUILDING],
      cost: 20,
      adjacencyBonus,
      metadata,

      behavior: {
        production: {heat: 4},
      },
    });
  }

  public override bespokePlay(player: Player) {
    return new SelectSpace('Select an ocean space for special tile', player.game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
      player.game.addTile(player, SpaceType.OCEAN, space, {tileType: TileType.MOHOLE_AREA});
      space.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
}
