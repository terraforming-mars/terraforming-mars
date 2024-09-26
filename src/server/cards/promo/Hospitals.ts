import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Board} from '../../boards/Board';
import {Space} from '../../boards/Space';
import {SelectCard} from '../../inputs/SelectCard';
import {all} from '../Options';
import {Size} from '../../../common/cards/render/Size';

export class Hospitals extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.HOSPITALS,
      cost: 8,
      tags: [Tag.BUILDING],
      resourceType: CardResource.DISEASE,

      behavior: {
        production: {energy: -1},
      },

      victoryPoints: 1,
      metadata: {
        cardNumber: 'X69',
        renderData: CardRenderer.builder((b) => {
          b.effect('Each time a city is placed, gain a disease here.', (eb) => {
            eb.city({size: Size.SMALL, all}).startEffect.resource(CardResource.DISEASE);
          }).br;
          b.action('Remove a disease from ANY OF YOUR CARDS to gain 1 M€ per city in play.', (ab) => {
            ab.resource(CardResource.DISEASE).asterix().startAction.megacredits(1).slash().city({size: Size.SMALL, all});
          }).br;
          b.production((pb) => pb.minus().energy(1));
        }),
        description: {
          text: 'Decrease your energy production 1 step.',
          align: 'left',
        },
      },
    });
  }

  public canAct(player: IPlayer) {
    return player.getResourceCount(CardResource.DISEASE) > 0;
  }

  public onTilePlaced(cardowner: IPlayer, _activePlayer: IPlayer, space: Space) {
    if (Board.isCitySpace(space)) {
      cardowner.addResourceTo(this, {qty: 1, log: true});
    }
  }

  public action(player: IPlayer) {
    const diseaseCards = player.getCardsWithResources(CardResource.DISEASE);
    const game = player.game;

    const input = new SelectCard('Remove a disease from ANY OF YOUR CARD to gain 1M€ per city in play',
      'Choose a card to remove 1 disease.',
      diseaseCards)
      .andThen(([card]) => {
        player.removeResourceFrom(card, 1);
        player.stock.add(Resource.MEGACREDITS, (game.board.getCities()).length, {log: true});
        return undefined;
      });
    if (diseaseCards.length === 0) {
      return undefined;
    }
    if (diseaseCards.length === 1) {
      input.cb(diseaseCards);
      return undefined;
    }
    return input;
  }
}
