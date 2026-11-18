import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {whiteTrackCubes} from '@/server/automa/corps/BaseGameCorps';

export class EcotecMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.ECOTEC,
      description: 'Tag: Plant. Draft: Plant > Microbe > Animal. Setup: 2 plant resources on card. Each Plant, Microbe or Animal tag (starting tag included) adds 1. Before the action phase, at 5+, spend 5 to advance plant track. Your cards may remove or steal plants from this card instead of from MarsBot\'s M€.',
      tags: [Tag.PLANT],
      draftPriority: {type: 'tags', tags: [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL]},
      trackCubes: whiteTrackCubes(6),
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.setCorpState('plantResources', 2);
    marsBot.game.log('MarsBot (Ecotec): 2 plant resources on card');
  }

  // Per tag, so a card with two plant tags adds two plants (rulebook B, p.1 card C40)
  public override onTagResolved(marsBot: IMarsBot, tag: Tag): void {
    if (tag === Tag.PLANT || tag === Tag.MICROBE || tag === Tag.ANIMAL) {
      marsBot.setCorpState('plantResources', marsBot.getCorpState('plantResources') + 1);
      marsBot.game.log('MarsBot (Ecotec): Plant/Microbe/Animal tag, +1 plant resource on card');
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    const plants = marsBot.getCorpState('plantResources');
    if (plants >= 5) {
      marsBot.setCorpState('plantResources', plants - 5);
      marsBot.advanceTrack(6); // Plant track = index 6
      marsBot.game.log('MarsBot (Ecotec): spent 5 plant resources, advance plant track');
    }
  }
}
