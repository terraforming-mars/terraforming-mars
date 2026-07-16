import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class TradeEmbargo extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.TRADE_EMBARGO,
      tags: [Tag.SPACE],
      cost: 4,

      metadata: {
        cardNumber: 'SW01',
        renderData: CardRenderer.builder((b) => {
          b.text('Nobody may trade for the rest of this generation.', Size.LARGE);
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.tradeEmbargo = true;
    return undefined;
  }
}
