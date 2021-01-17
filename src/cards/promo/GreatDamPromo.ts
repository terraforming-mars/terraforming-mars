import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
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
      tags: [Tags.ENERGY, Tags.BUILDING],

      metadata: {
        cardNumber: '136',
        requirements: CardRequirements.builder((b) => b.oceans(4)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2)).tile(TileType.GREAT_DAM, true, false).asterix();
        }),
        description: 'Requires 4 ocean tiles. Increase your Energy production 2 steps. Place this tile ADJACENT TO an ocean tile.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const meetsOceanRequirements = super.canPlay(player);
    const canPlaceTile = this.getAvailableSpaces(player, game).length > 0;

    return meetsOceanRequirements && canPlaceTile;
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY, 2);

    const availableSpaces = this.getAvailableSpaces(player, game);
    if (availableSpaces.length < 1) return undefined;

    return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
      game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.GREAT_DAM});
      return undefined;
    });
  }

  public getVictoryPoints() {
    return 1;
  }

  private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
    return game.board.getAvailableSpacesOnLand(player)
      .filter(
        (space) => game.board.getAdjacentSpaces(space).filter(
          (adjacentSpace) => Board.isOceanSpace(adjacentSpace),
        ).length > 0,
      );
  }
}

