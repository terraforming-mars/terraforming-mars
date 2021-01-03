import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class DevelopmentCenter extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DEVELOPMENT_CENTER,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '014',
        renderData: CardRenderer.builder((b) => {
          b.effectBox((eb) => {
            eb.energy(1).startAction.cards(1);
            eb.description('Action: Spend 1 Energy to draw a card.');
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.energy > 0;
  }
  public action(player: Player, game: Game) {
    player.energy--;
    player.cardsInHand.push(game.dealer.dealCard());
    return undefined;
  }
}
