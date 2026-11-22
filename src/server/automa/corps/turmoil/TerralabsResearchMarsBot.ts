import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class TerralabsResearchMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.TERRALABS_RESEARCH,
      description: 'Tag: Science. Setup: TR -8. Each generation: draw 1 card to action deck (2 cards from generation 9 onward).',
      tags: [Tag.SCIENCE],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.raiseTR(-8);
    marsBot.game.log('MarsBot (${0}): TR -8', (b) => b.cardName(this.name));
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    const count = marsBot.game.generation <= 8 ? 1 : 2;
    marsBot.drawProjectCardsToActionDeck(count);
    marsBot.game.log('MarsBot (${0}): drew ${1} card(s) to action deck', (b) => b.cardName(this.name).number(count));
  }
}
