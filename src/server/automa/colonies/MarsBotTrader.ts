import {CardName} from '@/common/cards/CardName';
import {ColonyName} from '@/common/colonies/ColonyName';
import {IGame} from '@/server/IGame';
import {IColony} from '@/server/colonies/IColony';
import {ColoniesHandler} from '@/server/colonies/ColoniesHandler';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {pickByFlippedCard} from '@/server/automa/MarsBotCardFlip';

/** Breaks a tie among candidate tiles by revealing a project card (rulebook C, p.5). */
function selectTiedColony(game: IGame, candidates: Array<IColony>): IColony {
  return pickByFlippedCard(game, candidates) ?? candidates[0];
}

/**
 * Picks the colony tile MarsBot trades with (rulebook C, p.5).
 *
 * The tile furthest along its colony track wins. A tie goes to a tile with MarsBot's colony,
 * then to a revealed project card. Returns undefined when no tile can be traded with.
 */
export function selectTradeColony(marsBot: IMarsBot): IColony | undefined {
  const game = marsBot.game;
  const tradeable = ColoniesHandler.tradeableColonies(game);
  if (tradeable.length === 0) {
    return undefined;
  }
  if (tradeable.length === 1) {
    return tradeable[0];
  }

  // Highest track position
  const maxTrack = Math.max(...tradeable.map((c) => c.trackPosition));
  let candidates = tradeable.filter((c) => c.trackPosition === maxTrack);
  if (candidates.length === 1) {
    return candidates[0];
  }

  // Prefer tiles where MarsBot has a colony
  const withMarsBotColony = candidates.filter((c) => c.colonies.includes(marsBot.player.id));
  if (withMarsBotColony.length === 1) {
    return withMarsBotColony[0];
  }
  if (withMarsBotColony.length > 1) {
    candidates = withMarsBotColony;
  }

  // Random among remaining tied candidates
  return selectTiedColony(game, candidates);
}

/**
 * Trades with `colony` for MarsBot.
 *
 * MarsBot pays 1 M€ and stores 2 resources in the tile's storage area instead of the track's
 * income, 3 when it has a colony there. Europa raises its TR instead, and Titan gives
 * floaters. The player's colonies on the tile pay their colony bonus, the track drops back to
 * the number of colonies, and the tile is visited until the end of the generation (rulebook C, p.5).
 */
export function tradeWithColony(marsBot: IMarsBot, colony: IColony): void {
  const game = marsBot.game;

  marsBot.loseMc(1);
  colony.visitor = marsBot.player.id;

  if (colony.name === ColonyName.EUROPA) {
    game.log('MarsBot pays 1:r:mc: to trade with ${0}, raises its TR 1 step', (b) => b.colony(colony));
    marsBot.player.increaseTerraformRating(1);
  } else {
    const amount = colony.colonies.includes(marsBot.player.id) ? 3 : 2;
    if (colony.name === ColonyName.TITAN) {
      if (game.gameOptions.expansions.venus) {
        game.log('MarsBot pays 1:r:mc: to trade with ${0}, gains ${1} floaters', (b) => b.colony(colony).number(amount));
      } else {
        game.log('MarsBot pays 1:r:mc: to trade with ${0}, gains ${1} floaters in Titan storage', (b) => b.colony(colony).number(amount));
      }
      marsBot.addFloaters(amount);
    } else {
      game.log('MarsBot pays 1:r:mc: to trade with ${0}, gains ${1} resources in storage', (b) => b.colony(colony).number(amount));
      marsBot.shippingBoard.add(colony.name, amount);
    }
  }

  // MarsBot's own colony "bonus" is the extra resource above, not the tile's bonus
  for (const playerId of colony.colonies) {
    if (playerId === marsBot.player.id) {
      continue;
    }
    const humanPlayer = game.players.find((p) => p.id === playerId);
    if (humanPlayer !== undefined) {
      colony.giveColonyBonus(humanPlayer);
    }
  }

  colony.trackPosition = colony.colonies.length;
}

/**
 * Trades with the colony MarsBot picks, for the bonus card `cardName` (rulebook C, p.5).
 *
 * Does nothing, with no Failed Action, when no colony can be traded with or MarsBot has no M€ to pay.
 */
export function maybeTrade(marsBot: IMarsBot, cardName: CardName): void {
  const colony = selectTradeColony(marsBot);
  if (colony === undefined) {
    // A bonus card that can't resolve is not a Failed Action (rulebook A, p.5)
    marsBot.game.log('MarsBot (${0}): no colony to trade with', (b) => b.cardName(cardName));
    return;
  }
  // It must lose 1 M€ to trade. With none, the card does nothing (Nick, BGG 3599965).
  if (marsBot.megacredits < 1) {
    marsBot.game.log('MarsBot (${0}): no M€ to pay for the trade', (b) => b.cardName(cardName));
    return;
  }

  tradeWithColony(marsBot, colony);
}
