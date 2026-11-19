import {CardResource} from '@/common/CardResource';
import {Resource} from '@/common/Resource';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';
import {message} from '@/server/logs/MessageBuilder';

export class SpliceMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.SPLICE,
      description: 'Tag: Plant. Draft: Microbe. Setup: +8 M€, remove R&D, add a Microbe card to bonus deck. Microbe cards earn 4 M€. When human plays a Microbe card, earn 2 M€ and the human gains 2 M€ or adds a microbe to that card.',
      tags: [Tag.PLANT],
      draftPriority: {type: 'tags', tags: [Tag.MICROBE]},
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.gainMc(8);
    marsBot.removeBonusCard(BonusCardId.B03_RESEARCH_AND_DEVELOPMENT);
    marsBot.addProjectCardsToBonusDeck(Tag.MICROBE, 1);
    marsBot.game.log('MarsBot (${0}): +8:r:mc:, R&D removed, microbe card added to bonus deck', (b) => b.cardName(this.name));
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.tags.includes(Tag.MICROBE)) {
      marsBot.gainMc(4);
      marsBot.game.log('MarsBot (${0}): microbe card, +4:r:mc:', (b) => b.cardName(this.name));
    }
  }

  public override onHumanCardPlayed(marsBot: IMarsBot, card: IProjectCard): void {
    if (!card.tags.includes(Tag.MICROBE)) {
      return;
    }
    marsBot.gainMc(2);
    marsBot.game.log('MarsBot (${0}): human played microbe, +2:r:mc:', (b) => b.cardName(this.name));

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
  }
}
