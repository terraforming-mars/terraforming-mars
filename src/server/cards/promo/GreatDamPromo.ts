import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {Board} from '../../boards/Board';
import {Space} from '../../boards/Space';
import {PlaceTile} from '../../deferredActions/PlaceTile';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {message} from '../../logs/MessageBuilder';

export class GreatDamPromo extends Card implements IProjectCard {
  constructor(
    name = CardName.GREAT_DAM_PROMO,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: 'X32',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.energy(2)).tile(TileType.GREAT_DAM, true, false).asterix();
      }),
      description: 'Requires 4 ocean tiles. Increase your energy production 2 steps. Place this tile ADJACENT TO an ocean tile.',
    },
  ) {
    super({
      type: CardType.AUTOMATED,
      name,
      cost: 15,
      tags: [Tag.POWER, Tag.BUILDING],
      metadata,
      adjacencyBonus,

      behavior: {
        production: {energy: 2},
      },

      requirements: {oceans: 4},
      victoryPoints: 1,
    });
  }
  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new PlaceTile(player, {
        tile: {tileType: TileType.GREAT_DAM, card: this.name},
        on: () => this.getAvailableSpaces(player),
        title: message('Select space for ${0}', (b) => b.card(this)),
        adjacencyBonus: this.adjacencyBonus,
      }));
    return undefined;
  }

  private getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): Array<Space> {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter(
        (space) => player.game.board.getAdjacentSpaces(space).filter(
          (adjacentSpace) => Board.isOceanSpace(adjacentSpace),
        ).length > 0,
      );
  }
}

