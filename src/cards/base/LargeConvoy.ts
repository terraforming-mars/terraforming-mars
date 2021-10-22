import {ICard} from '../ICard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {PlayerInput} from '../../PlayerInput';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {digit} from '../Options';

export class LargeConvoy extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.LARGE_CONVOY,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 36,
      tr: {oceans: 1},
      victoryPoints: 2,

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

  public play(player: Player): PlayerInput | undefined {
    player.drawCard(2);

    const animalCards = player.getResourceCards(ResourceType.ANIMAL);

    const gainPlants = function() {
      player.addResource(Resources.PLANTS, 5, {log: true});
      player.game.defer(new PlaceOceanTile(player));
      return undefined;
    };

    if (animalCards.length === 0 ) return gainPlants();

    const availableActions: Array<SelectOption | SelectCard<ICard>> = [];

    const gainPlantsOption = new SelectOption('Gain 5 plants', 'Gain plants', gainPlants);
    availableActions.push(gainPlantsOption);

    if (animalCards.length === 1) {
      const targetAnimalCard = animalCards[0];
      availableActions.push(new SelectOption('Add 4 animals to ' + targetAnimalCard.name, 'Add animals', () => {
        player.addResourceTo(targetAnimalCard, {qty: 4, log: true});
        player.game.defer(new PlaceOceanTile(player));
        return undefined;
      }));
    } else {
      availableActions.push(
        new SelectCard(
          'Select card to add 4 animals',
          'Add animals',
          animalCards,
          (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0], {qty: 4, log: true});
            player.game.defer(new PlaceOceanTile(player));
            return undefined;
          },
        ),
      );
    }

    return new OrOptions(...availableActions);
  }
}
