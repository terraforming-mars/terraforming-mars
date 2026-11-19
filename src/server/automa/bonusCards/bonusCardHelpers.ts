/**
 * Shared helper functions for MarsBot bonus card definitions.
 */
import {CardResource} from '@/common/CardResource';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {pickByFlippedCard} from '@/server/automa/MarsBotCardFlip';
import {ICard} from '@/server/cards/ICard';

/**
 * Removes the player's animal or microbe worth the most VP, for the bonus card `source`.
 *
 * False when no card has one MarsBot may remove. Cards that score their resources come first, then
 * the rest; a tie goes to a flipped project card (BGG 3360797).
 */
export function maybeRemoveAnimalOrMicrobe(marsBot: IMarsBot, source: CardName): boolean {
  const game = marsBot.game;
  const humanPlayer = marsBot.humanPlayer;
  // Protected Habitat blocks animal/microbe removal
  const isProtected = humanPlayer.playedCards.has(CardName.PROTECTED_HABITATS);

  // Pets and Bioengineering Enclosure protect their resources from opponents
  const candidates = isProtected ? [] : humanPlayer.playedCards.filter((played) =>
    (played.resourceCount ?? 0) > 0 && played.protectedResources !== true &&
    (played.resourceType === CardResource.ANIMAL || played.resourceType === CardResource.MICROBE));
  if (candidates.length > 0) {
    const best = Math.max(...candidates.map(vpPerResource));
    const tied = candidates.filter((played) => vpPerResource(played) === best);
    const card = tied.length > 1 ? pickByFlippedCard(game, tied) ?? tied[0] : tied[0];
    humanPlayer.removeResourceFrom(card, 1, {removingPlayer: marsBot.player, log: false});
    game.log('MarsBot (${0}): removed 1 ${1} from ${2}',
      (b) => b.cardName(source).rawString(card.resourceType ?? '').card(card));
    return true;
  }
  if (isProtected) {
    game.log('MarsBot (${0}): blocked by Protected Habitats', (b) => b.cardName(source));
  } else {
    game.log('MarsBot (${0}): no animal/microbe resources to remove', (b) => b.cardName(source));
  }
  return false;
}

/** The VP one resource on `card` is worth, or 0 when the card doesn't score its resources (Vermin included). */
function vpPerResource(card: ICard): number {
  const vp = card.victoryPoints;
  if (typeof vp === 'object' && vp.resourcesHere !== undefined) {
    return (vp.each ?? 1) / (vp.per ?? 1);
  }
  return 0;
}
