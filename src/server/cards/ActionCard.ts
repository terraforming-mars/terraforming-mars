import {Behavior} from '@/server/behavior/Behavior';
import {IPlayer} from '@/server/IPlayer';
import {Card, StaticCardProperties} from '@/server/cards/Card';
import {getBehaviorExecutor} from '@/server/behavior/BehaviorExecutor';

// Same as StaticCardProperties, but action is expected.
export interface StaticActionCardProperties extends StaticCardProperties {
  action: Behavior;
}

/**
 * A Card that has a data-defined behavior in `action`.
 */
export abstract class ActionCard extends Card {
  // Add actionBehavior to StaticCardProperties, otherwise this will multiple memory consumption.
  constructor(properties: StaticActionCardProperties) {
    super(properties);
  }
  public canAct(player: IPlayer) {
    if (this.properties.action === undefined) {
      throw new Error('action not defined');
    }
    if (!getBehaviorExecutor().canExecute(this.properties.action, player, this)) {
      return false;
    }
    return this.bespokeCanAct(player);
  }

  public action(player: IPlayer) {
    if (this.properties.action === undefined) {
      throw new Error('action not defined');
    }
    getBehaviorExecutor().execute(this.properties.action, player, this);
    return this.bespokeAction(player);
  }

  public bespokeCanAct(_player: IPlayer): boolean {
    return true;
  }

  public bespokeAction(_player: IPlayer) {
    return undefined;
  }
}
