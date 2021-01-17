import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import * as constants from '../../constants';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {StandardActionCard} from './StandardActionCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';


export class ConvertPlants extends StandardActionCard {
  public name = CardName.CONVERT_PLANTS;

  public canAct(player: Player): boolean {
    if (player.plants < player.plantsNeededForGreenery) {
      return false;
    }
    if (player.game.board.getAvailableSpacesForGreenery(player).length === 0) {
      return false;
    }
    if (player.game.getOxygenLevel() === constants.MAX_OXYGEN_LEVEL) {
      return true;
    }
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(REDS_RULING_POLICY_COST);
    }
    return true;
  }

  public action(player: Player) {
    return new SelectSpace(
      `Convert ${player.plantsNeededForGreenery} plants into greenery`,
      player.game.board.getAvailableSpacesForGreenery(player),
      (space: ISpace) => {
        this.actionPlayed(player);
        player.game.addGreenery(player, space.id);
        player.plants -= player.plantsNeededForGreenery;
        return undefined;
      },
    );
  }

  public metadata: CardMetadata = {
    cardNumber: 'SA1',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 8 Plants to place a greenery tile and raise oxygen 1 step.', (eb) => {
        eb.plants(8).startAction.greenery().secondaryTag(AltSecondaryTag.OXYGEN);
      }),
    ),
  };
}
