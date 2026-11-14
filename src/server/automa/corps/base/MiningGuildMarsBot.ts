import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// ---- C06 Mining Guild ----
// Tags: Building x2. Setup: 10 MC on card.
// Effect: when earning MC, deduct from card first. When card empty, refill 10 + advance building track.
export const MINING_GUILD_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.MINING_GUILD,
  description: 'Tags: 2 Building. Setup: 10 MC on card. Until the building track reaches #18, MC MarsBot earns comes off this card; when empty, refill 10 MC, advance building track, and take the rest of the MC off the refilled card.',
  tags: [Tag.BUILDING, Tag.BUILDING],
  setup(marsBot) {
    marsBot.setCorpState('mcOnCard', 10);
    marsBot.game.log('MarsBot (Mining Guild): 10 M€ placed on card');
  },
  effect: {
    // The card is a countdown: M€ MarsBot earns is removed from the card, but the bot keeps the
    // earnings. Each time the card empties, refill 10 M€ and advance the building track, and the
    // rest of the gain comes off the refilled card. Once the game has ended the card stops, like
    // Philares (BGG 3513998).
    onMcGained(marsBot, amount) {
      if (marsBot.game.isDoneWithFinalProduction()) {
        return;
      }
      let remaining = amount;
      // Building track at #18: the card stops. The advance can reach it mid-gain.
      while (remaining > 0 && marsBot.marsBotBoard.tracks[0].position < 18) {
        const mcOnCard = marsBot.getCorpState('mcOnCard');
        const taken = Math.min(remaining, mcOnCard);
        remaining -= taken;
        if (mcOnCard - taken > 0) {
          marsBot.setCorpState('mcOnCard', mcOnCard - taken);
          return;
        }
        // Refill first: M€ the advance earns re-enters here and comes off the refilled card
        marsBot.setCorpState('mcOnCard', 10);
        marsBot.game.log('MarsBot (Mining Guild): card empty, refill 10 M€ + advance building track');
        marsBot.advanceTrack(0); // Building track = index 0
      }
    },
  },
};
