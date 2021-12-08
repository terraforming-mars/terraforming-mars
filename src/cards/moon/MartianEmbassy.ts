import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {played} from '../Options';

export class MartianEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARTIAN_EMBASSY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.MARS],
      cost: 11,

      metadata: {
        cardNumber: 'M76',
        description: 'Raise the Mars Planetary Track 1 step for every 3 Moon tags you have, including this.',
        renderData: CardRenderer.builder((b) => {
          b.mars(1, {played}).planetaryTrack().text('+1').slash().moon(3);
        }),
      },
    });
  };

  public play(player: Player) {
    // The +1 is "including this".
    const tags = player.getTagCount(Tags.MOON) + 1;
    const rate = Math.floor(tags / 3);
    PathfindersExpansion.raiseTrack(Tags.MARS, player, rate);
    return undefined;
  }
}
