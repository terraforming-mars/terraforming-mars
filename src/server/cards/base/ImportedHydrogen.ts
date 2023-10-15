import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {PlayerInput} from '../../PlayerInput';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {message} from '../../logs/MessageBuilder';

export class ImportedHydrogen extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.IMPORTED_HYDROGEN,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 16,

      behavior: {
        ocean: {},
      },

      metadata: {
        cardNumber: '019',
        renderData: CardRenderer.builder((b) => {
          b.plants(3, {digit});
          b.or();
          b.microbes(3, {digit}).asterix().or();
          b.animals(2, {digit}).asterix().br;
          b.oceans(1);
        }),
        description: 'Gain 3 plants, or add 3 microbes or 2 animals to ANOTHER card. Place an ocean tile.',
      },
    });
  }

  public override bespokePlay(player: IPlayer): undefined | PlayerInput {
    const availableMicrobeCards = player.getResourceCards(CardResource.MICROBE);
    const availableAnimalCards = player.getResourceCards(CardResource.ANIMAL);

    const gainPlants = function() {
      player.stock.add(Resource.PLANTS, 3, {log: true});
      return undefined;
    };

    if (availableMicrobeCards.length === 0 && availableAnimalCards.length === 0) {
      return gainPlants();
    }

    const availableActions: Array<PlayerInput> = [];

    const gainPlantsOption = new SelectOption('Gain 3 plants', 'Gain plants').andThen(gainPlants);
    availableActions.push(gainPlantsOption);

    if (availableMicrobeCards.length === 1) {
      const targetMicrobeCard = availableMicrobeCards[0];
      availableActions.push(new SelectOption(message('Add ${0} microbes to ${1}', (b) => b.number(3).card(targetMicrobeCard)), 'Add microbes').andThen(() => {
        player.addResourceTo(targetMicrobeCard, {qty: 3, log: true});
        return undefined;
      }));
    } else if (availableMicrobeCards.length > 1) {
      availableActions.push(new SelectCard('Add 3 microbes to a card',
        'Add microbes',
        availableMicrobeCards)
        .andThen(([card]) => {
          player.addResourceTo(card, {qty: 3, log: true});
          return undefined;
        }));
    }

    if (availableAnimalCards.length === 1) {
      const targetAnimalCard = availableAnimalCards[0];
      availableActions.push(new SelectOption(message('Add ${0} animals to ${1}', (b) => b.number(2).card(targetAnimalCard)), 'Add animals').andThen(() => {
        player.addResourceTo(targetAnimalCard, {qty: 2, log: true});
        return undefined;
      }));
    } else if (availableAnimalCards.length > 1) {
      availableActions.push(new SelectCard('Add 2 animals to a card', 'Add animals', availableAnimalCards)
        .andThen(([card]) => {
          player.addResourceTo(card, {qty: 2, log: true});
          return undefined;
        }));
    }

    return new OrOptions(...availableActions);
  }
}
