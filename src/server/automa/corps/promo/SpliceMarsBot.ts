import {CardResource} from '@/common/CardResource';
import {Resource} from '@/common/Resource';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';
import {message} from '@/server/logs/MessageBuilder';

// C24 Splice
export const SPLICE_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.SPLICE,
  description: 'Tag: Plant. Draft: Microbe. Setup: +8 MC, remove R&D, add a Microbe card to bonus deck. Microbe cards earn 4 MC. When human plays a Microbe card, earn 2 MC and the human gains 2 MC or adds a microbe to that card.',
  tags: [Tag.PLANT],
  draftPriority: {type: 'tags', tags: [Tag.MICROBE]},
  setup(marsBot) {
    marsBot.gainMc(8);
    marsBot.removeBonusCard(BonusCardId.B03_RESEARCH_AND_DEVELOPMENT);
    marsBot.addProjectCardsToBonusDeck(Tag.MICROBE, 1);
    marsBot.game.log('MarsBot (Splice): +8 M€, R&D removed, microbe card added to bonus deck');
  },
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.tags.includes(Tag.MICROBE)) {
        marsBot.gainMc(4);
        marsBot.game.log('MarsBot (Splice): microbe card, +4 M€');
      }
    },
    onHumanCardPlayed(marsBot, card) {
      if (!card.tags.includes(Tag.MICROBE)) {
        return;
      }
      marsBot.gainMc(2);
      marsBot.game.log('MarsBot (Splice): human played microbe, +2 M€');

      // The player gains 2 M€, or adds a microbe to the card they played
      const human = marsBot.humanPlayer;
      const gainMC = new SelectOption(message('Gain ${0} M€', (b) => b.number(2)), 'Gain M€').andThen(() => {
        human.stock.add(Resource.MEGACREDITS, 2, {log: true});
        return undefined;
      });
      if (card.resourceType === CardResource.MICROBE) {
        const addMicrobe = new SelectOption('Add a microbe resource to this card', 'Add microbe').andThen(() => {
          human.addResourceTo(card, {log: true});
          return undefined;
        });
        human.defer(new OrOptions(addMicrobe, gainMC));
      } else {
        gainMC.cb(undefined);
      }
    },
  },
};
