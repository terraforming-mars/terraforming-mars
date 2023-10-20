import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';
import {message} from '../../logs/MessageBuilder';

export class ExtremeColdFungus extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EXTREME_COLD_FUNGUS,
      tags: [Tag.MICROBE],
      cost: 13,

      requirements: {temperature: -10, max},
      metadata: {
        cardNumber: '134',
        description: 'It must be -10 C or colder.',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 plant.', (eb) => {
            eb.empty().startAction.plants(1);
          }).br;
          b.or().br;
          b.action('Add 2 microbes to ANOTHER card.', (eb) => {
            eb.empty().startAction.microbes(2).asterix();
          });
        }),
      },
    });
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: IPlayer) {
    const otherMicrobeCards = player.getResourceCards(CardResource.MICROBE);

    if (otherMicrobeCards.length === 0) {
      player.stock.add(Resource.PLANTS, 1, {log: true});
      return undefined;
    }

    const gainPlantOption = new SelectOption('Gain 1 plant', 'Gain plant').andThen(() => {
      player.stock.add(Resource.PLANTS, 1, {log: true});
      return undefined;
    });

    if (otherMicrobeCards.length === 1) {
      const targetCard = otherMicrobeCards[0];

      return new OrOptions(
        new SelectOption(message('Add ${0} microbes to ${1}', (b) => b.number(2).card(targetCard)), 'Add microbes').andThen(() => {
          player.addResourceTo(targetCard, {qty: 2, log: true});
          return undefined;
        }),
        gainPlantOption,
      );
    }

    return new OrOptions(
      new SelectCard(
        'Select card to add 2 microbes',
        'Add microbes',
        otherMicrobeCards)
        .andThen(([card]) => {
          player.addResourceTo(card, {qty: 2, log: true});
          return undefined;
        }),
      gainPlantOption,
    );
  }
}
