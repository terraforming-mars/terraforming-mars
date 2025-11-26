import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {ActionCard} from '@/server/cards/ActionCard';
import {CardType} from '@/common/cards/CardType';
import {CanAffordOptions, IPlayer} from '@/server/IPlayer';
import {TileType} from '@/common/TileType';
import {PlaceTile} from '@/server/deferredActions/PlaceTile';
import {Space} from '@/server/boards/Space';
import {CardName} from '@/common/cards/CardName';
import {Board} from '@/server/boards/Board';
import {AdjacencyBonus} from '@/server/ares/AdjacencyBonus';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class IndustrialCenter extends ActionCard implements IProjectCard {
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
      type: CardType.ACTIVE,
      name,
      tags: [Tag.BUILDING],
      cost: 4,
      adjacencyBonus,

      action: {
        spend: {megacredits: 7},
        production: {steel: 1},
      },
      metadata,
    });
  }

  private getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): Array<Space> {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space) => player.game.board.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)));
  }
  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }
  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new PlaceTile(player, {
        tile: {tileType: TileType.INDUSTRIAL_CENTER, card: this.name},
        on: () => this.getAvailableSpaces(player),
        title: 'Select space adjacent to a city tile',
        adjacencyBonus: this.adjacencyBonus,
      }));
    return undefined;
  }
}
