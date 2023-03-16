import {Behavior} from '../behavior/Behavior';
import {Player} from '../Player';
<<<<<<< HEAD
import {Card, StaticCardProperties, validateBehavior} from './Card';
=======
import {Card, StaticCardProperties} from './Card';
>>>>>>> main
import {getBehaviorExecutor} from '../behavior/BehaviorExecutor';

export interface StaticActionCardProperties extends StaticCardProperties {
  action: Behavior;
}

export abstract class ActionCard extends Card {
<<<<<<< HEAD
  // Add actionBehavior to StaticCardProperties, otherwise this will multiple memory consumption.
  private actionBehavior: Behavior;
  constructor(properties: StaticActionCardProperties) {
    super(properties);
    validateBehavior(properties.action);
=======
  // This will replicate. Find a way to store it. Possibly pass it down.
  private actionBehavior: Behavior;
  constructor(properties: StaticActionCardProperties) {
    super(properties);
>>>>>>> main
    this.actionBehavior = properties.action;
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
