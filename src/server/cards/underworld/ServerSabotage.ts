import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {cancelled} from '../Options';
import {Tag} from '../../../common/cards/Tag';
export class ServerSabotage extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SERVER_SABOTAGE,
      tags: [Tag.CRIME],
      cost: 9,

      behavior: {
        underworld: {corruption: 1},
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'U047',
        renderData: CardRenderer.builder((b) => {
          // TODO(kberg): Use icon.
          b.corruption(1).cards(1).undergroundResources(1, {cancelled});
        }),
        description: 'Gain 1 corruption. Draw a card. Remove all underground resources from the board.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    UnderworldExpansion.removeAllUnclaimedTokens(player.game);
    return undefined;
  }
}
