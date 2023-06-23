import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {inplaceRemove} from '../../../common/utils/utils';

export class Stefan extends CeoCard {
  constructor() {
    super({
      name: CardName.STEFAN,
      metadata: {
        cardNumber: 'L19',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('SELL').cards(1).colon().megacredits(3);
        }),
        description: 'Once per game, sell any number of cards from your hand for 3 M€ each.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.cardsInHand.length > 0;
  }


  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    return new SelectCard(
      'Sell patents',
      'Sell',
      player.cardsInHand,
      (foundCards: Array<IProjectCard>) => {
        player.megaCredits += foundCards.length * 3;

        foundCards.forEach((card) => {
          inplaceRemove(player.cardsInHand, card);
          player.game.projectDeck.discard(card);
        });

        player.game.log('${0} sold ${1} patents', (b) => b.player(player).number(foundCards.length));
        return undefined;
      }, {min: 0, max: player.cardsInHand.length},
    );
  }
}
