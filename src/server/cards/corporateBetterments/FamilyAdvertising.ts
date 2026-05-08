import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';

export class FamilyAdvertising extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.FAMILY_ADVERTISING,
      cost: 5,
      metadata: {
        cardNumber: 'B37',
        description: 'Redo 2 used actions on 2 of your active cards.',
        renderData: CardRenderer.builder((b) => {
          b.text('Re-enable actions on 2 of your used active cards.');
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const used = player.playedCards
      .filter((c) => c.type === CardType.ACTIVE && c.isDisabled)
      .slice(0, 2);
    for (const card of used) {
      card.isDisabled = false;
      player.game.log('${0} refreshed action on ${1}', (b) => b.player(player).card(card));
    }
    return undefined;
  }
}
