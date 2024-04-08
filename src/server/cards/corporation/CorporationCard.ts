import {CardType} from '../../../common/cards/CardType';
import {ICorporationCard} from './ICorporationCard';
import {Card, StaticCardProperties} from '../Card';
import {IPlayer} from '../../IPlayer';
import {getBehaviorExecutor} from '../../behavior/BehaviorExecutor';
import {IActionCard} from '../ICard';

export abstract class CorporationCard extends Card implements ICorporationCard {
  constructor(external: Omit<StaticCardProperties, 'type'>) {
    // Corporation cards don't need a type defined for them.
    super({...external, type: CardType.CORPORATION});
  }
  public override get type(): CardType.CORPORATION {
    return CardType.CORPORATION;
  }
}

/**
 * A corporation card that can parse an `action: {}` stanza.
 */
export abstract class ActiveCorporationCard extends CorporationCard implements IActionCard {
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
