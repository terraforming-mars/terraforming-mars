import {CardName} from '@/common/cards/CardName';
import {IPlayer} from '@/server/IPlayer';
import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {PathfindersExpansion} from '@/server/pathfinders/PathfindersExpansion';

export class MartianEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARTIAN_EMBASSY,
      type: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.MARS],
      cost: 11,

      metadata: {
        cardNumber: 'M76',
        description: 'Raise the Mars Planetary Track 1 step for every 3 Moon tags you have, including this.',
        renderData: CardRenderer.builder((b) => {
          b.tag(Tag.MARS).planetaryTrack().text('+1').slash().tag(Tag.MOON, 3);
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    // The +1 is "including this".
    const tags = player.tags.count(Tag.MOON) + 1;
    const rate = Math.floor(tags / 3);
    PathfindersExpansion.raiseTrack(Tag.MARS, player, rate);
    return undefined;
  }
}
