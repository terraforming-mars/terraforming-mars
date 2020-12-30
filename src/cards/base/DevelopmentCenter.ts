import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class DevelopmentCenter implements IActionCard, IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE, Tags.BUILDING];
    public name = CardName.DEVELOPMENT_CENTER;
    public cardType = CardType.ACTIVE;

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
    public metadata: CardMetadata = {
      cardNumber: '014',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.energy(1).startAction.cards(1);
          eb.description('Action: Spend 1 Energy to draw a card.');
        });
      }),
    }
}
