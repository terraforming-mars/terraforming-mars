import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import {SelectCard} from '../../inputs/SelectCard';
import {LogHelper} from '../../LogHelper';
import {IProjectCard} from '../IProjectCard';

export class Stefan extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.STEFAN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L19',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('SELL').cards(1).colon().megacredits(3);
        }),
        description: 'Once per game, sell any number of cards from hand for 3 M€ each.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.cardsInHand.length > 0 && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    return new SelectCard(
      'Sell patents',
      'Sell',
      player.cardsInHand,
      (foundCards: Array<IProjectCard>) => {
        player.megaCredits += foundCards.length * 3;

        foundCards.forEach((card) => {
          for (let i = 0; i < player.cardsInHand.length; i++) {
            if (player.cardsInHand[i].name === card.name) {
              player.cardsInHand.splice(i, 1);
              break;
            }
          }
          player.game.projectDeck.discard(card);
        });

        player.game.log('${0} sold ${1} patents', (b) => b.player(player).number(foundCards.length));
        LogHelper.logDrawnCards(player, foundCards.map((card)=>card.name), true);
        this.isDisabled = true;
        return undefined;
      }, {max: player.cardsInHand.length},
    );
  }
}
