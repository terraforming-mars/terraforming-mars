import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {REDS_RULING_POLICY_COST} from '../../../constants';
import {StandardProjectCard} from '../../StandardProjectCard';
import {PartyHooks} from '../../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../turmoil/parties/PartyName';
import * as constants from '../../../constants';
import {PlaceGreeneryTile} from '../../../deferredActions/PlaceGreeneryTile';

export class GreeneryStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.GREENERY_STANDARD_PROJECT,
      cost: 23,
      metadata: {
        cardNumber: 'SP6',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 23 M€ to place a greenery tile and raise oxygen 1 step.', (eb) => {
            eb.megacredits(23).startAction.greenery();
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    let greeneryCost = this.cost;
    const oxygenNotMaxed = player.game.getOxygenLevel() < constants.MAX_OXYGEN_LEVEL;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && oxygenNotMaxed) greeneryCost += REDS_RULING_POLICY_COST;

    return player.canAfford(greeneryCost) && player.game.board.getAvailableSpacesForGreenery(player).length > 0;
  }

  actionEssence(player: Player): void {
    player.game.defer(new PlaceGreeneryTile(player, 'Select space for greenery'));
  }
}
