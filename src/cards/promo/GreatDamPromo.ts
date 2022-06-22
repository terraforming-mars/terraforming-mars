import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../common/TileType';
import {ISpace} from '../../boards/ISpace';
import {Board} from '../../boards/Board';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Units} from '../../common/Units';

export class GreatDamPromo extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREAT_DAM_PROMO,
      cost: 15,
      tags: [Tags.ENERGY, Tags.BUILDING],
      productionBox: Units.of({energy: 2}),
      requirements: CardRequirements.builder((b) => b.oceans(4)),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'X32',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2)).tile(TileType.GREAT_DAM, true, false).asterix();
        }),
        description: 'Requires 4 ocean tiles. Increase your Energy production 2 steps. Place this tile ADJACENT TO an ocean tile.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 2);

    const availableSpaces = this.getAvailableSpaces(player);
    if (availableSpaces.length < 1) return undefined;

    return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.GREAT_DAM});
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

