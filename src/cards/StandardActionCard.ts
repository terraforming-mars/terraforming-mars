import {CardType} from './CardType';
import {Player} from '../Player';
import {ICardMetadata} from './ICardMetadata';
import {CardName} from '../CardName';
import {Card} from './Card';
import {IActionCard, ICard} from './ICard';
import {PlayerInput} from '../PlayerInput';

interface StaticStandardActionCardProperties {
  name: CardName,
  metadata: ICardMetadata,
}

export abstract class StandardActionCard extends Card implements IActionCard, ICard {
  constructor(properties: StaticStandardActionCardProperties) {
    super({
      cardType: CardType.STANDARD_ACTION,
      ...properties,
    });
  }

  public abstract canAct(player: Player): boolean

  public abstract action(player: Player): PlayerInput | undefined

  protected actionUsed(player: Player) {
    player.game.log('${0} used ${1} standard action', (b) => b.player(player).card(this));
  }

  public play() {
    return undefined;
  }
}
