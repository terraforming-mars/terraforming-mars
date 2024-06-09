import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {PlayerInput} from '../../PlayerInput';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';
import {message} from '../../logs/MessageBuilder';

export class LargeConvoy extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.LARGE_CONVOY,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 36,
      victoryPoints: 2,

      behavior: {
        drawCard: 2,
        ocean: {},
      },

      metadata: {
        cardNumber: '143',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).cards(2).br;
          b.plants(5, {digit}).or(Size.MEDIUM).resource(CardResource.ANIMAL, {amount: 4, digit}).asterix();
        }),
        description: 'Place an ocean tile and draw 2 cards. Gain 5 plants or add 4 animals to ANOTHER card.',
      },
    });
  }

  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    const animalCards = player.getResourceCards(CardResource.ANIMAL);

    const gainPlants = function() {
      player.stock.add(Resource.PLANTS, 5, {log: true});
      return undefined;
    };

    if (animalCards.length === 0 ) return gainPlants();

    const availableActions = [];

    const gainPlantsOption = new SelectOption('Gain 5 plants', 'Gain plants').andThen(gainPlants);
    availableActions.push(gainPlantsOption);

    if (animalCards.length === 1) {
      const targetAnimalCard = animalCards[0];
      availableActions.push(new SelectOption(message('Add ${0} animals to ${1}', (b) => b.number(4).card(targetAnimalCard)), 'Add animals').andThen(() => {
        player.addResourceTo(targetAnimalCard, {qty: 4, log: true});
        return undefined;
      }));
    } else {
      availableActions.push(
        new SelectCard(
          'Select card to add 4 animals',
          'Add animals',
          animalCards)
          .andThen(([card]) => {
            player.addResourceTo(card, {qty: 4, log: true});
            return undefined;
          }),
      );
    }

    return new OrOptions(...availableActions);
  }
}
