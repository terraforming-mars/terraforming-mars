import {BonusCardId} from '@/common/automa/AutomaTypes';
import {Tag} from '@/common/cards/Tag';
import {cardTagsIncludingEvent} from '@/server/automa/MarsBotTags';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {inplaceShuffle} from '@/server/utils/shuffle';

export class InterfaceHyperlinkMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B30_INTERFACE_HYPERLINK});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // Tycho Magnetics: draw 1 card per space of the energy track, at least 2, play the 2 best and
    // discard the rest. The card is destroyed once it plays a card.
    const name = createBonusCard(this.id).name;
    const marsBotBoard = marsBot.marsBotBoard;
    const energyTrack = marsBotBoard.tagToTrack[Tag.POWER];
    const count = Math.max(2, energyTrack === undefined ? 0 : marsBotBoard.tracks[energyTrack].position);
    const drawn = marsBot.game.projectDeck.drawN(marsBot.game, count);
    if (drawn.length === 0) {
      marsBot.game.log('MarsBot (${0}): no cards to draw', (b) => b.cardName(name));
      return false;
    }
    // Science cards first, then the most expensive, then the most tags, then at random
    const science = (card: IProjectCard) => cardTagsIncludingEvent(card).includes(Tag.SCIENCE) ? 1 : 0;
    const tagCount = (card: IProjectCard) => cardTagsIncludingEvent(card).length;
    inplaceShuffle(drawn, marsBot.game.rng);
    drawn.sort((a, b) => science(b) - science(a) || b.cost - a.cost || tagCount(b) - tagCount(a));
    const discarded = drawn.splice(2);
    marsBot.game.projectDeck.discard(...discarded);
    for (const card of drawn) {
      marsBot.game.log('MarsBot (${0}): draws and resolves ${1}', (b) => b.cardName(name).card(card));
      marsBot.resolveProjectCard(card);
    }
    marsBot.game.log('MarsBot (${0}): card destroyed', (b) => b.cardName(name));
    return true;
  }
}
