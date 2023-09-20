import {Behavior} from '../behavior/Behavior';
import {IPlayer} from '../IPlayer';
import {Card, StaticCardProperties, validateBehavior} from './Card';
import {getBehaviorExecutor} from '../behavior/BehaviorExecutor';

export interface StaticActionCardProperties extends StaticCardProperties {
  action: Behavior;
}

export abstract class ActionCard extends Card {
  // Add actionBehavior to StaticCardProperties, otherwise this will multiple memory consumption.
  private actionBehavior: Behavior;
  constructor(properties: StaticActionCardProperties) {
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
