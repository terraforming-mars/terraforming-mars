import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {PlayerInput} from '../../PlayerInput';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class ImportedHydrogen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
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
        description: 'Gain 3 Plants, or add 3 Microbes or 2 Animals to ANOTHER card. Place an ocean tile.',
      },
    });
  }

  public override bespokePlay(player: Player): undefined | PlayerInput {
    const availableMicrobeCards = player.getResourceCards(CardResource.MICROBE);
    const availableAnimalCards = player.getResourceCards(CardResource.ANIMAL);

    const gainPlants = function() {
      player.addResource(Resources.PLANTS, 3, {log: true});
      return undefined;
    };

    if (availableMicrobeCards.length === 0 && availableAnimalCards.length === 0) {
      return gainPlants();
    }

    const availableActions: Array<PlayerInput> = [];

    const gainPlantsOption = new SelectOption('Gain 3 plants', 'Gain plants', gainPlants);
    availableActions.push(gainPlantsOption);

    if (availableMicrobeCards.length === 1) {
      const targetMicrobeCard = availableMicrobeCards[0];
      availableActions.push(new SelectOption('Add 3 microbes to ' + targetMicrobeCard.name, 'Add microbes', () => {
        player.addResourceTo(targetMicrobeCard, {qty: 3, log: true});
        return undefined;
      }));
    } else if (availableMicrobeCards.length > 1) {
      availableActions.push(new SelectCard('Add 3 microbes to a card',
        'Add microbes',
        availableMicrobeCards, ([card]) => {
          player.addResourceTo(card, {qty: 3, log: true});
          return undefined;
        }));
    }

    if (availableAnimalCards.length === 1) {
      const targetAnimalCard = availableAnimalCards[0];
      availableActions.push(new SelectOption('Add 2 animals to ' + targetAnimalCard.name, 'Add animals', () => {
        player.addResourceTo(targetAnimalCard, {qty: 2, log: true});
        return undefined;
      }));
    } else if (availableAnimalCards.length > 1) {
      availableActions.push(new SelectCard('Add 2 animals to a card', 'Add animals', availableAnimalCards, ([card]) => {
        player.addResourceTo(card, {qty: 2, log: true});
        return undefined;
      }));
    }

    return new OrOptions(...availableActions);
  }
}
