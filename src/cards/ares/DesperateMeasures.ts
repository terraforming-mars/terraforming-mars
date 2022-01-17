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
      victoryPoints: -2,

      metadata: {
        cardNumber: 'A04',
        description: 'Place a bronze cube on a dust storm tile and raise oxygen 1 step, or place a bronze cube on an erosion tile and raise the temperature 1 step. The hazard tile with the bronze cube cannot be removed.',
        renderData: CardRenderer.builder((b) => {
          b.resourceCube().asterix().br;
          b.temperature(1).slash().oxygen(1);
        }),
      },
    });
  }

  private getHazardTiles(game: Game) {
    return game.board.spaces.filter((space) => AresHandler.hasHazardTile(space));
  }

  public override canPlay(player: Player): boolean {
    // You can't play desperate measures if there isn't a hazard marker in play.
    return this.getHazardTiles(player.game).length > 0;
  }

  public play(player: Player) {
    return new SelectSpace('Select a hazard space to protect', this.getHazardTiles(player.game), (space: ISpace) => {
        space.tile!.protectedHazard = true;
        const tileType = space.tile!.tileType;
        if (TileType.DUST_STORM_MILD === tileType || TileType.DUST_STORM_SEVERE === tileType) {
          player.game.increaseOxygenLevel(player, 1);
        } else {
          // is an erosion tile when the expression above is false.
          player.game.increaseTemperature(player, 1);
        }
        return undefined;
    });
  }
}
