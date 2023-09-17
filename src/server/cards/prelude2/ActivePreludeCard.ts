import {validateBehavior} from '../Card';
import {Behavior} from '../../behavior/Behavior';
import {IPreludeCard} from '../prelude/IPreludeCard';
import {IActionCard} from '../ICard';
import {PreludeCard, StaticPreludeProperties} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {getBehaviorExecutor} from '../../behavior/BehaviorExecutor';

export interface StaticActionPreludeProperties extends StaticPreludeProperties {
  action: Behavior;
}

/** A prelude card with an action. Duplicates code from ActionCard. */
export abstract class ActivePreludeCard extends PreludeCard implements IPreludeCard, IActionCard {
  private actionBehavior: Behavior;
  constructor(properties: StaticActionPreludeProperties) {
    super(properties);
    this.actionBehavior = properties.action;
    validateBehavior(properties.action);
  }
  public canAct(player: IPlayer) {
    if (!getBehaviorExecutor().canExecute(this.actionBehavior, player, this)) {
      return false;
    }
    return this.bespokeCanAct(player);
  }

  public action(player: IPlayer) {
    getBehaviorExecutor().execute(this.actionBehavior, player, this);
    return this.bespokeAction(player);
  }

  public bespokeCanAct(_player: IPlayer): boolean {
    return true;
  }

  public bespokeAction(_player: IPlayer) {
    return undefined;
  }
}
