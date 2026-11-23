import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';

/** A bonus card MarsBot resolves. */
export abstract class MarsBotBonusCard {
  public readonly name: BonusCardName;

  constructor(name: BonusCardName) {
    this.name = name;
  }

  /**
   * Resolves this card for `marsBot`.
   *
   * Returns true when the card must not be discarded: it was destroyed, or it went back into the bonus deck.
   */
  public abstract resolve(marsBot: IMarsBot): boolean;

  /** Logs that this card is destroyed, and returns true for `resolve` to pass on. */
  protected logDestroyed(marsBot: IMarsBot): boolean {
    marsBot.game.log('MarsBot (${0}): card destroyed', (b) => b.bonusCardName(this.name));
    return true;
  }
}
