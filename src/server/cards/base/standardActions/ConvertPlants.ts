import {StandardActionCard} from '../../StandardActionCard';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {IPlayer} from '../../../IPlayer';
import {MAX_OXYGEN_LEVEL} from '../../../../common/constants';
import {SelectSpace} from '../../../inputs/SelectSpace';
import {Units} from '../../../../common/Units';
import {message} from '../../../logs/MessageBuilder';


export class ConvertPlants extends StandardActionCard {
  constructor() {
    super({
      name: CardName.CONVERT_PLANTS,
      metadata: {
        cardNumber: 'SA2',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 8 plants to place a greenery tile and raise oxygen 1 step.', (eb) => {
            eb.plants(8).startAction.greenery();
          }),
        ),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
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
    return player.canAfford({
      cost: 0,
      tr: {oxygen: 1},
      reserveUnits: Units.of({plants: player.plantsNeededForGreenery}),
    });
  }

  public action(player: IPlayer) {
    return new SelectSpace(
      message('Convert ${0} plants into greenery', (b) => b.number(player.plantsNeededForGreenery)),
      player.game.board.getAvailableSpacesForGreenery(player))
      .andThen((space) => {
        this.actionUsed(player);
        player.game.addGreenery(player, space);
        player.plants -= player.plantsNeededForGreenery;
        return undefined;
      });
  }
}
