import {IActionCard} from '@/server/cards/ICard';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {IPlayer} from '@/server/IPlayer';
import {getBehaviorExecutor} from '@/server/behavior/BehaviorExecutor';
import {PlayerInput} from '@/server/PlayerInput';

/**
 * A prelude card with an action property. Duplicates code from ActionCard.
 */
export abstract class ActivePreludeCard extends PreludeCard implements IActionCard {
  public canAct(player: IPlayer) {
    if (this.properties.action === undefined) {
      throw new Error('action not defined');
    }
    if (!getBehaviorExecutor().canExecute(this.properties.action, player, this)) {
      return false;
    }
    return this.bespokeCanAct(player);
  }

  public action(player: IPlayer): PlayerInput | undefined {
    if (this.properties.action === undefined) {
      throw new Error('action not defined');
    }
    getBehaviorExecutor().execute(this.properties.action, player, this);
    return this.bespokeAction(player);
  }

  public bespokeCanAct(_player: IPlayer): boolean {
    return true;
  }

  public bespokeAction(_player: IPlayer): PlayerInput | undefined {
    return undefined;
  }
}
