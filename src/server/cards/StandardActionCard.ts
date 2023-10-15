import {CardType} from '../../common/cards/CardType';
import {ICardMetadata} from '../../common/cards/ICardMetadata';
import {CardName} from '../../common/cards/CardName';
import {Card} from './Card';
import {IActionCard, ICard} from './ICard';
import {PlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';

interface StaticStandardActionCardProperties {
  name: CardName,
  metadata: ICardMetadata,
}

export abstract class StandardActionCard extends Card implements IActionCard, ICard {
  constructor(properties: StaticStandardActionCardProperties) {
    super({
      type: CardType.STANDARD_ACTION,
      ...properties,
    });
  }

  public override get type(): CardType.STANDARD_ACTION {
    return CardType.STANDARD_ACTION;
  }

  public abstract canAct(player: IPlayer): boolean

  public abstract action(player: IPlayer): PlayerInput | undefined

  protected actionUsed(player: IPlayer) {
    player.game.log('${0} used ${1} standard action', (b) => b.player(player).card(this));
  }
}
