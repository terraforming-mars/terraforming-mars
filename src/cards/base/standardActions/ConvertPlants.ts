import {StandardActionCard} from '../../StandardActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {MAX_OXYGEN_LEVEL} from '../../../common/constants';
import {SelectSpace} from '../../../inputs/SelectSpace';
import {ISpace} from '../../../boards/ISpace';
import {Units} from '../../../common/Units';


export class ConvertPlants extends StandardActionCard {
  constructor() {
    super({
      name: CardName.CONVERT_PLANTS,
      metadata: {
        cardNumber: 'SA2',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 8 Plants to place a greenery tile and raise oxygen 1 step.', (eb) => {
            eb.plants(8).startAction.greenery();
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    if (player.plants < player.plantsNeededForGreenery) {
      return false;
    }
    if (player.game.board.getAvailableSpacesForGreenery(player).length === 0) {
      return false;
    }
    if (player.game.getOxygenLevel() === MAX_OXYGEN_LEVEL) {
      // The level is maximized, and that means you don't have to try to figure out if the
      // player can afford the reds tax when increasing the oxygen level.
      return true;
    }
    return player.canAfford(0, {
      tr: {oxygen: 1},
      reserveUnits: Units.of({plants: player.plantsNeededForGreenery}),
    });
  }

  public action(player: Player) {
    return new SelectSpace(
      `Convert ${player.plantsNeededForGreenery} plants into greenery`,
      player.game.board.getAvailableSpacesForGreenery(player),
      (space: ISpace) => {
        this.actionUsed(player);
        player.game.addGreenery(player, space.id);
        player.plants -= player.plantsNeededForGreenery;
        return undefined;
      },
    );
  }
}
