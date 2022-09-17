import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {Board} from '../../boards/Board';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class IndustrialCenter extends Card implements IActionCard, IProjectCard {
  constructor(
    name = CardName.INDUSTRIAL_CENTER,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '123',
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 7 M€ to increase your steel production 1 step.', (eb) => {
          eb.megacredits(7).startAction.production((pb) => pb.steel(1));
        }).br;
        b.tile(TileType.INDUSTRIAL_CENTER, true, false).asterix();
      }),
      description: 'Place this tile adjacent to a city tile.',
    }) {
    super({
      cardType: CardType.ACTIVE,
      name,
      tags: [Tag.BUILDING],
      cost: 4,
      adjacencyBonus,

      metadata,
    });
  }

  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter((space) => player.game.board.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)));
  }
  public override bespokeCanPlay(player: Player): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }
  public override bespokePlay(player: Player) {
    return new SelectSpace('Select space adjacent to a city tile', this.getAvailableSpaces(player), (space: ISpace) => {
      player.game.addTile(player, space.spaceType, space, {tileType: TileType.INDUSTRIAL_CENTER});
      space.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
  public canAct(player: Player): boolean {
    return player.canAfford(7);
  }
  public action(player: Player) {
    player.game.defer(new SelectPaymentDeferred(player, 7, {title: 'Select how to pay for action'}));
    player.production.add(Resources.STEEL, 1);
    return undefined;
  }
}
