import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';

export class Pandemic extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PANDEMIC,
      tags: [Tag.MICROBE],
      cost: 12,

      action: {},

      metadata: {
        cardNumber: 'SH002',
        description: 'Requires 2 cards with microbes on it',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Add a microbe to all your cards that can hold microbes',
            (eb) => {
              eb.empty().startAction.resource(CardResource.MICROBE).asterix();
            },
          );
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const cardsWithMicrobes = player.getCardsWithResources(CardResource.MICROBE);
    return cardsWithMicrobes.length >= 2;
  }

  public override bespokeAction(player: IPlayer): undefined {
    player.getResourceCards(CardResource.MICROBE).forEach((card) => {
      player.addResourceTo(card, {qty: 1, log: true});
    });
    return undefined;
  }
}
