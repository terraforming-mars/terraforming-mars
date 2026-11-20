import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';

export type MarsBotBonusCardProperties = Pick<MarsBotBonusCard, 'id' | 'name'>;

/**
 * A bonus card MarsBot resolves.
 *
 * Each card with a class of its own overrides `resolve`. A card without one yet is a blank card:
 * resolving it does nothing.
 */
export class MarsBotBonusCard {
  public readonly id: BonusCardId;
  public readonly name: CardName;

  constructor(properties: MarsBotBonusCardProperties) {
    this.id = properties.id;
    this.name = properties.name;
  }

  /**
   * Resolves this card for `marsBot`.
   *
   * Returns true when the card must not be discarded: it was destroyed, or it went back into the bonus deck.
   */
  public resolve(_marsBot: IMarsBot): boolean {
    return false;
  }

  /** Logs that this card is destroyed, and returns true for `resolve` to pass on. */
  protected logDestroyed(marsBot: IMarsBot): boolean {
    marsBot.game.log('MarsBot (${0}): card destroyed', (b) => b.cardName(this.name));
    return true;
  }
}
