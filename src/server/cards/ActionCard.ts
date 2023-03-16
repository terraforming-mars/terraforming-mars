import {Behavior} from '../behavior/Behavior';
import {Player} from '../Player';
import {Card, StaticCardProperties, validateBehavior} from './Card';
import {getBehaviorExecutor} from '../behavior/BehaviorExecutor';
import {IActionCard} from './ICard';

export interface StaticActionCardProperties extends StaticCardProperties {
  action: Behavior;
}

export abstract class ActionCard extends Card implements IActionCard {
  // Add actionBehavior to StaticCardProperties, otherwise this will multiple memory consumption.
  private actionBehavior: Behavior;
  constructor(properties: StaticActionCardProperties) {
    super(properties);
    this.actionBehavior = properties.action;
    validateBehavior(properties.action);
  }
  public canAct(player: Player) {
    if (!getBehaviorExecutor().canExecute(this.actionBehavior, player, this)) {
      return false;
    }
    return this.bespokeCanAct(player);
  }

  public action(player: Player) {
    getBehaviorExecutor().execute(this.actionBehavior, player, this);
    return this.bespokeAction(player);
  }

  public bespokeCanAct(_player: Player): boolean {
    return true;
  }

  public bespokeAction(_player: Player) {
    return undefined;
  }
}
