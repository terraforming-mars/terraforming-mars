import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class SaturnSystemsMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.SATURN_SYSTEMS,
      description: 'Tags: Jovian, 3 Space. Draft: Jovian > Space. When you play a Jovian card or MarsBot resolves a Jovian tag (starting tag included), advance event track.',
      tags: [Tag.JOVIAN, Tag.SPACE, Tag.SPACE, Tag.SPACE],
      draftPriority: {type: 'tags', tags: [Tag.JOVIAN, Tag.SPACE]},
    });
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.tags.includes(Tag.JOVIAN)) {
      marsBot.advanceTrack(2);
      marsBot.game.log('MarsBot (${0}): Jovian tag played, advance event track', (b) => b.cardName(this.name));
    }
  }

  public override onHumanCardPlayed(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.tags.includes(Tag.JOVIAN)) {
      marsBot.advanceTrack(2);
      marsBot.game.log('MarsBot (${0}): Human played Jovian, advance event track', (b) => b.cardName(this.name));
    }
  }
}
