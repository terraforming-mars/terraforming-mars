import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {PreludesExpansion} from '../../preludes/PreludesExpansion';
import {IPlayer} from '../../IPlayer';


export class WGProject extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 9,
      tags: [Tag.EARTH],
      name: CardName.WG_PROJECT,
      type: CardType.AUTOMATED,

      requirements: {chairman: true},

      metadata: {
        description: 'Requires that you are Chairman. DRAW 3 PRELUDE CARDS AND PLAY 1 OF THEM, Discard the other 2.',
        cardNumber: 'P91',
        renderData: CardRenderer.builder((b) => b.prelude().asterix()),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.game.preludeDeck.canDraw(3);
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const cards = game.preludeDeck.drawNOrThrow(game, 3);
    return PreludesExpansion.selectPreludeToPlay(player, cards, 'discard');
  }
}
