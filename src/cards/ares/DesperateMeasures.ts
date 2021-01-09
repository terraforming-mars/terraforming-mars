import {Card} from '../Card';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../TileType';
import {AresHandler} from '../../ares/AresHandler';
import {CardRenderer} from '../render/CardRenderer';

export class DesperateMeasures extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DESPERATE_MEASURES,
      cost: 1,

      metadata: {
        cardNumber: 'A04',
        description: 'Effect: Place a bronze cube on a dust storm tile and raise oxygen 1 step, or place a bronze cube on an erosion tile and raise the temperature 1 step. The hazard tile with the bronze cube cannot be removed.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).slash().oxygen(1);
        }),
        victoryPoints: -2,
      },
    });
  }

  private getHazardTiles(game: Game) {
    return game.board.spaces.filter((space) => AresHandler.hasHazardTile(space));
  }

  public canPlay(_player: Player, game: Game): boolean {
    // You can't play desperate measures if there isn't a hazard marker in play.
    return this.getHazardTiles(game).length > 0;
  }

  public play(player: Player, game: Game) {
    return new SelectSpace('Select a hazard space to protect', this.getHazardTiles(game), (space: ISpace) => {
        space.tile!.protectedHazard = true;
        const tileType = space.tile!.tileType;
        if (TileType.DUST_STORM_MILD === tileType || TileType.DUST_STORM_SEVERE === tileType) {
          game.increaseOxygenLevel(player, 1);
        } else {
          // is an erosion tile when the expression above is false.
          game.increaseTemperature(player, 1);
        }
        return undefined;
    });
  }

  public getVictoryPoints() {
    return -2;
  }
}
