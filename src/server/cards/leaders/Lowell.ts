import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import {Tag} from '../../../common/cards/Tag';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class Lowell extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.LOWELL,
      cardType: CardType.LEADER,
      tags: [Tag.WILD],
      metadata: {
        cardNumber: 'L12',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().megacredits(8).colon().text('CHANGE CEO').asterix();
          b.br.br;
        }),
        description: 'Once per game, pay 8 M€ to draw 3 CEOs cards and choose one to play. Discard this card.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.canAfford(8) && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const cardsDrawn: Array<IProjectCard> = [];
    const game = player.game;
    for (let i = 0; i < 3; i++) {
      cardsDrawn.push(game.leaderDeck.draw(game));
    }

    player.game.defer(new SelectPaymentDeferred(player, 8, {title: 'Select how to pay for action'}));
    this.isDisabled = true;

    return new SelectCard('Choose leader card to play', 'Play', cardsDrawn, (foundCards: Array<IProjectCard>) => {
      const cardIndex = player.playedCards.findIndex((c) => c.name === this.name);
      player.playedCards.splice(cardIndex, 1);

      return player.playCard(foundCards[0]);
    });
  }
}
