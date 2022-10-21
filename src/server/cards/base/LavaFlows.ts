import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class LavaFlows extends Card implements IProjectCard {
  constructor(
    name = CardName.LAVA_FLOWS,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '140',
      renderData: CardRenderer.builder((b) => {
        b.temperature(2).br;
        b.tile(TileType.LAVA_FLOWS, true, false).asterix();
      }),
      description: 'Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS.',
    }) {
    super({
      cardType: CardType.EVENT,
      name,
      cost: 18,
      adjacencyBonus,
      metadata,
      tr: {temperature: 2},
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForType(player, 'volcanic').length > 0;
  }
  public override bespokePlay(player: Player) {
    player.game.increaseTemperature(player, 2);
    const spaces = player.game.board.getAvailableSpacesForType(player, 'volcanic');
    return new SelectSpace('Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons', spaces, (space: ISpace) => {
      player.game.addTile(player, space, {tileType: TileType.LAVA_FLOWS});
      space.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
}
