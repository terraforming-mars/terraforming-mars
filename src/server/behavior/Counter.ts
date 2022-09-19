// import {Units} from '../../common/Units';
import {ICard} from '../cards/ICard';
import {Player} from '../Player';
import {Countable} from './Countable';
import {intersection} from '../../common/utils/utils';

/**
 * Counts things in game state.
 *
 * The constructor accepts the game state, which is essentially the player, and the card being played or acted upon.
 */
export class Counter {
  /**
   * True if the `this.card` is still in the player's hand.
   *
   * Many cards that counts tags have this "+1" that includes itself. That's because the
   * card isn't already in the playedCards pile. If it was, we wouldn't need this additional bit of
   * playedCard.
   *
   * The other part of why includeCard is interesting is sometimes this counting is related to a card
   * being replayed via Robotic Workforce. In that case, the card is already played.
   *
   * Counter is not meant to be kept between game states, so dispose of this after making calcuations.
   */
  private cardIsUnplayed: boolean;

  public constructor(private player: Player, private card: ICard) {
    this.cardIsUnplayed = card !== undefined && !player.cardIsInEffect(card.name);
  }
  public count(countable: Countable): number {
    if (typeof(countable) === 'number') {
      return countable;
    }

    let sum = 0;

    const player = this.player;
    const card = this.card;
    const game = player.game;

    if (countable.tag !== undefined) {
      const tag = countable.tag;

      if (Array.isArray(tag)) { // Multiple tags
        // These two error cases could be coded up, but they don't have a case just yet, and if they do come
        // up, better for the code to error than silently ignore it.
        if (this.cardIsUnplayed && intersection(tag, card.tags).length > 0) {
          throw new Error(`Not supporting the case counting tags ${tag} when played card tags are ${card.tags}`);
        }
        if (countable.others === true) {
          throw new Error('Not counting others\' multiple Tags.');
        }

        sum += player.tags.multipleCount(tag);
      } else { // Single tag
        if (countable.others !== true) { // Just count player's own tags.
          sum += player.tags.count(tag);

          if (this.cardIsUnplayed) { // And include the card itself if it isn't already on the tableau.
            sum += card.tags.filter((t) => t === tag).length;
          }
        }

        // When counting all the other players' tags, just count raw, so as to disregard their wild tags.
        if (countable.all === true || countable.others === true) {
          game.getPlayers()
            .filter((p) => p.id !== player.id)
            .forEach((p) => sum += p.tags.count(tag, 'raw'));
        }
      }
    }

    if (countable.each !== undefined) {
      sum = sum * countable.each;
    }
    if (countable.per !== undefined) {
      sum = Math.floor(sum / countable.per);
    }
    return sum;
  }
}
