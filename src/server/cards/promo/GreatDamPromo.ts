import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../../common/TileType';
import {ISpace} from '../../boards/ISpace';
import {Board} from '../../boards/Board';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class GreatDamPromo extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREAT_DAM_PROMO,
      cost: 15,
      tags: [Tag.ENERGY, Tag.BUILDING],

      behavior: {
        production: {energy: 2},
      },

      requirements: CardRequirements.builder((b) => b.oceans(4)),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'X32',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2)).tile(TileType.GREAT_DAM, true, false).asterix();
        }),
        description: 'Requires 4 ocean tiles. Increase your energy production 2 steps. Place this tile ADJACENT TO an ocean tile.',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }

  public override bespokePlay(player: Player) {
    const availableSpaces = this.getAvailableSpaces(player);
    if (availableSpaces.length < 1) return undefined;

    return new SelectSpace('Select space for tile', availableSpaces, (space: ISpace) => {
      player.game.addTile(player, space.spaceType, space, {tileType: TileType.GREAT_DAM});
      return undefined;
    });
  }

  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter(
        (space) => player.game.board.getAdjacentSpaces(space).filter(
          (adjacentSpace) => Board.isOceanSpace(adjacentSpace),
        ).length > 0,
      );
  }
}

