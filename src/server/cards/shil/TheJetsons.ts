import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';

export class TheJetsons extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.THE_JETSONS,
      tags: [],
      cost: 13,

      action: {},

      metadata: {
        cardNumber: 'SH003',
        description: 'Requires at least 2 cards with floaters',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Add a floater to all your cards that can hold floaters',
            (eb) => {
              eb.empty().startAction.resource(CardResource.FLOATER).asterix();
            },
          );
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const cardsWithFloaters = player.getCardsWithResources(CardResource.FLOATER);
    return cardsWithFloaters.length >= 2;
  }

  public override bespokeAction(player: IPlayer): undefined {
    player.getResourceCards(CardResource.FLOATER).forEach((card) => {
      player.addResourceTo(card, {qty: 1, log: true});
    });
    return undefined;
  }
}
