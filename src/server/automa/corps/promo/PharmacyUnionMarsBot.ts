import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class PharmacyUnionMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.PHARMACY_UNION,
      description: 'Tag: Science. Draft: Science. Setup: remove Meteor Shower; shuffle a revealed Science card into the bonus deck. Science cards (starting tag included) give +1 TR. When human plays a Microbe card, lose 4 M€.',
      tags: [Tag.SCIENCE],
      draftPriority: {type: 'tags', tags: [Tag.SCIENCE]},
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.removeBonusCard(BonusCardId.B01_METEOR_SHOWER);
    marsBot.addProjectCardsToBonusDeck(Tag.SCIENCE, 1);
    marsBot.game.log('MarsBot (Pharmacy Union): Meteor Shower removed, science card added to bonus deck');
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.tags.includes(Tag.SCIENCE)) {
      marsBot.raiseTR(1);
      marsBot.game.log('MarsBot (Pharmacy Union): science card, TR +1');
    }
  }

  public override onHumanCardPlayed(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.tags.includes(Tag.MICROBE)) {
      marsBot.megacredits = Math.max(0, marsBot.megacredits - 4);
      marsBot.game.log('MarsBot (Pharmacy Union): human played microbe, -4 M€');
    }
  }
}
