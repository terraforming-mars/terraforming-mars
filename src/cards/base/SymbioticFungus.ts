import {Tags} from '../Tags';
import {IActionCard, ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {SelectCard} from '../../inputs/SelectCard';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SymbioticFungus extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SYMBIOTIC_FUNGUS,
      tags: [Tags.MICROBE],
      cost: 4,

      metadata: {
        cardNumber: '133',
        requirements: CardRequirements.builder((b) => b.temperature(-14)),
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
    const availableCards = player.getResourceCards(ResourceType.MICROBE);
    if (availableCards.length === 0) return undefined;

    if (availableCards.length === 1) {
      player.addResourceTo(availableCards[0]);
      LogHelper.logAddResource(player, availableCards[0]);
      return undefined;
    }

    return new SelectCard('Select card to add microbe', 'Add microbe', availableCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0]);
      LogHelper.logAddResource(player, foundCards[0]);
      return undefined;
    });
  }
}

