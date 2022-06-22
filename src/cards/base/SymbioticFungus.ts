import {Tags} from '../../common/cards/Tags';
import {IActionCard, ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SymbioticFungus extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SYMBIOTIC_FUNGUS,
      tags: [Tags.MICROBE],
      cost: 4,

      requirements: CardRequirements.builder((b) => b.temperature(-14)),
      metadata: {
        cardNumber: '133',
        renderData: CardRenderer.builder((b) => {
          b.action('Add a microbe to ANOTHER card.', (eb) => {
            eb.empty().startAction.microbes(1).asterix();
          });
        }),
        description: 'Requires -14 C° or warmer.',
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const availableCards = player.getResourceCards(CardResource.MICROBE);
    if (availableCards.length === 0) return undefined;

    if (availableCards.length === 1) {
      player.addResourceTo(availableCards[0], {log: true});
      return undefined;
    }

    return new SelectCard('Select card to add microbe', 'Add microbe', availableCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], {log: true});
      return undefined;
    });
  }
}

