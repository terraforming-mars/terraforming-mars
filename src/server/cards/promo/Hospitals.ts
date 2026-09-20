import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {Board} from '../../boards/Board';
import {Space} from '../../boards/Space';
import {all} from '../Options';
import {Size} from '../../../common/cards/render/Size';

export class Hospitals extends ActionCard implements IProjectCard, IActionCard {
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

      action: {
        spend: {resourceFromAnyCard: {type: CardResource.DISEASE}},
        stock: {megacredits: {cities: {}}},
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

  public onTilePlaced(cardowner: IPlayer, _activePlayer: IPlayer, space: Space) {
    if (Board.isCitySpace(space)) {
      cardowner.addResourceTo(this, {qty: 1, log: true});
    }
  }
}
