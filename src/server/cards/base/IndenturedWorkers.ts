import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {uppercase} from '../Options';

export class IndenturedWorkers extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.INDENTURED_WORKERS,
      cost: 0,
      victoryPoints: -1,

      metadata: {
        cardNumber: '195',
        renderData: CardRenderer.builder((b) => {
          b.text('next card', {size: Size.SMALL, uppercase}).colon().megacredits(-8);
        }),
        description: 'The next card you play this generation costs 8 M€ less.',
      },
    });
  }

  public override getCardDiscount(player: IPlayer) {
    if (player.lastCardPlayed === this.name) {
      return 8;
    }
    return 0;
  }
}
