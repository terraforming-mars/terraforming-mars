import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {MarsBotBonusCard, createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {IMarsBot} from '@/server/automa/IMarsBot';

export type MarsBotBonusCardEffectProperties = Pick<MarsBotBonusCardEffect, 'id'>;

/** A bonus card MarsBot resolves. */
export abstract class MarsBotBonusCardEffect {
  public readonly id: BonusCardId;
  public readonly name: CardName;

  constructor(properties: MarsBotBonusCardEffectProperties) {
    this.id = properties.id;
    this.name = createBonusCard(properties.id).name;
  }

  /**
   * Resolves `card` for `marsBot`.
   *
   * Returns true when the card must not be discarded: it was destroyed, or it went back into the bonus deck.
   */
  public abstract resolve(marsBot: IMarsBot, card: MarsBotBonusCard): boolean;

  /** Logs that this card is destroyed, and returns true for `resolve` to pass on. */
  protected logDestroyed(marsBot: IMarsBot): boolean {
    marsBot.game.log('MarsBot (${0}): card destroyed', (b) => b.cardName(this.name));
    return true;
  }
}
