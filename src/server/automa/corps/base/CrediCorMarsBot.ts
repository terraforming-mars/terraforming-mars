import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class CrediCorMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.CREDICOR,
      description: 'Draft: most expensive card. Effect: card cost 20+ gives 4 M€.',
      draftPriority: {type: 'mostExpensive'},
    });
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.cost >= 20) {
      marsBot.gainMc(4);
      marsBot.game.log(`MarsBot (Credicor): card cost ${card.cost} >= 20, gain 4 M€`);
    }
  }
}
