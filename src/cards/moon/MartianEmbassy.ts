import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

export class MartianEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARTIAN_EMBASSY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.MARS],
      cost: 11,

      metadata: {
        cardNumber: 'M76',
        description: 'Raise the Mars Planetary Track 1 step for each 3 Moon tags you have.',
        renderData: CardRenderer.builder((b) => {
          b.text('mars track').slash().moon(3);
        }),
      },
    });
  };

  public play(player: Player) {
    const tags = player.getTagCount(Tags.MOON);
    const rate = Math.floor(tags / 3);
    PathfindersExpansion.raiseTrack(Tags.MARS, player, rate);
    return undefined;
  }
}
