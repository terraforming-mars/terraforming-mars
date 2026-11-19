import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {whiteTrackCubes} from '@/server/automa/corps/corpHelpers';

export class ArklightMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.ARKLIGHT,
      description: 'Tag: Animal. Draft: Animal > Plant. White cubes on plant track. Each Plant or Animal tag resolved (starting tag included) earns 2 M€.',
      tags: [Tag.ANIMAL],
      draftPriority: {type: 'tags', tags: [Tag.ANIMAL, Tag.PLANT]},
      trackCubes: whiteTrackCubes(6),
    });
  }

  // Per tag, so a card with a plant and an animal tag earns 4 M€
  public override onTagResolved(marsBot: IMarsBot, tag: Tag): void {
    if (tag === Tag.PLANT || tag === Tag.ANIMAL) {
      marsBot.gainMc(2);
      marsBot.game.log('MarsBot (${0}): Plant/Animal tag, +2:r:mc:', (b) => b.cardName(this.name));
    }
  }
}
