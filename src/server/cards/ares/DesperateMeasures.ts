import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {IGame} from '../../IGame';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../../common/TileType';
import {AresHandler} from '../../ares/AresHandler';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';

export class DesperateMeasures extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.DESPERATE_MEASURES,
      cost: 1,
      victoryPoints: -2,

      metadata: {
        cardNumber: 'A04',
        description: 'Place a bronze cube on a dust storm tile and raise oxygen 1 step, or place a bronze cube on an erosion tile and raise the temperature 1 step. The hazard tile with the bronze cube cannot be removed.',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.RESOURCE_CUBE).asterix().br;
          b.temperature(1).slash().oxygen(1);
        }),
      },
    });
  }

  private getHazardTiles(game: IGame) {
    return game.board.spaces.filter((space) => AresHandler.hasHazardTile(space));
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    // You can't play desperate measures if there isn't a hazard marker in play.
    return this.getHazardTiles(player.game).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace('Select a hazard space to protect', this.getHazardTiles(player.game))
      .andThen((space) => {
        if (space.tile === undefined) {
          throw new Error(`selected space ${space.id} without tile for DesperateMeasures`);
        }
        space.tile.protectedHazard = true;
        const tileType = space.tile.tileType;
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
