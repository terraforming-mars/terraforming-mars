import {Player} from '../../Player';
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
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class LargeConvoy extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
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
          b.plants(5, {digit}).or(Size.MEDIUM).animals(4, {digit}).asterix();
        }),
        description: 'Place an ocean tile and draw 2 cards. Gain 5 Plants or add 4 Animals to ANOTHER card.',
      },
    });
  }

  public override bespokePlay(player: Player): PlayerInput | undefined {
    const animalCards = player.getResourceCards(CardResource.ANIMAL);

    const gainPlants = function() {
      player.addResource(Resources.PLANTS, 5, {log: true});
      return undefined;
    };

    if (animalCards.length === 0 ) return gainPlants();

    const availableActions: Array<PlayerInput> = [];

    const gainPlantsOption = new SelectOption('Gain 5 plants', 'Gain plants', gainPlants);
    availableActions.push(gainPlantsOption);

    if (animalCards.length === 1) {
      const targetAnimalCard = animalCards[0];
      availableActions.push(new SelectOption('Add 4 animals to ' + targetAnimalCard.name, 'Add animals', () => {
        player.addResourceTo(targetAnimalCard, {qty: 4, log: true});
        return undefined;
      }));
    } else {
      availableActions.push(
        new SelectCard(
          'Select card to add 4 animals',
          'Add animals',
          animalCards,
          ([card]) => {
            player.addResourceTo(card, {qty: 4, log: true});
            return undefined;
          },
        ),
      );
    }

    return new OrOptions(...availableActions);
  }
}
