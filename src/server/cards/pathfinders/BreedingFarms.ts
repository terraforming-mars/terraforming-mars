import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {Resources} from '../../../common/Resources';
import {CardRequirements} from '../CardRequirements';
import {Tag} from '../../../common/cards/Tag';

export class BreedingFarms extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BREEDING_FARMS,
      cost: 16,
      tags: [Tag.SCIENCE, Tag.ANIMAL, Tag.BUILDING],

      behavior: {
        global: {temperature: 1},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE).tag(Tag.ANIMAL)),
      metadata: {
        cardNumber: 'Pf01',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant to add 1 animal to ANY card.', (eb) => {
            eb.plants(1).startAction.animals(1);
          });
          b.br;
          b.temperature(1);
        }),
        description: 'Requires 1 science tag and 1 animal tag. Raise the temperature 1 step.',
      },
    });
  }

  public canAct(player: Player) {
    return player.plants > 0 && player.getResourceCards(CardResource.ANIMAL).length > 0;
  }

  public action(player: Player) {
    return new SelectCard(
      'Select a card to gain an animal resource',
      'Spend 1 plant',
      player.getResourceCards(CardResource.ANIMAL),
      ([card]) => {
        player.deductResource(Resources.PLANTS, 1);
        player.addResourceTo(card, {log: true});
        return undefined;
      });
  }
}

