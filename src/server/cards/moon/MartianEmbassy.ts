import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {played} from '../Options';

export class MartianEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARTIAN_EMBASSY,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.MARS],
      cost: 11,

      metadata: {
        cardNumber: 'M76',
        description: 'Raise the Mars Planetary Track 1 step for every 3 Moon tags you have, including this.',
        renderData: CardRenderer.builder((b) => {
          b.mars(1, {played}).planetaryTrack().text('+1').slash().moon(3);
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    // The +1 is "including this".
    const tags = player.tags.count(Tag.MOON) + 1;
    const rate = Math.floor(tags / 3);
    PathfindersExpansion.raiseTrack(Tag.MARS, player, rate);
    return undefined;
  }
}
