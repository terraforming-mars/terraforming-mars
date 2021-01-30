import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {PlayerInput} from '../../PlayerInput';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class ImportedHydrogen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_HYDROGEN,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 16,

      metadata: {
        cardNumber: '019',
        renderData: CardRenderer.builder((b) => {
          b.plants(3).digit;
          b.or();
          b.microbes(3).digit.asterix().or();
          b.animals(2).digit.asterix().br;
          b.oceans(1);
        }),
        description: 'Gain 3 Plants, or add 3 Microbes or 2 Animals to ANOTHER card. Place an ocean tile.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const oceansMaxed = player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, false, true);
    }

    return true;
  }

  public play(player: Player): undefined | PlayerInput {
    const availableMicrobeCards = player.getResourceCards(ResourceType.MICROBE);
    const availableAnimalCards = player.getResourceCards(ResourceType.ANIMAL);

    const gainPlants = function() {
      const qty = 3;
      player.plants += qty;
      LogHelper.logGainStandardResource(player, Resources.PLANTS, qty);
      player.game.defer(new PlaceOceanTile(player));
      return undefined;
    };

    if (availableMicrobeCards.length === 0 && availableAnimalCards.length === 0) {
      return gainPlants();
    }

    const availableActions: Array<SelectOption | SelectCard<ICard>> = [];

    const gainPlantsOption = new SelectOption('Gain 3 plants', 'Gain plants', gainPlants);
    availableActions.push(gainPlantsOption);

    if (availableMicrobeCards.length === 1) {
      const targetMicrobeCard = availableMicrobeCards[0];
      availableActions.push(new SelectOption('Add 3 microbes to ' + targetMicrobeCard.name, 'Add microbes', () => {
        player.addResourceTo(targetMicrobeCard, 3);
        LogHelper.logAddResource(player, targetMicrobeCard, 3);
        player.game.defer(new PlaceOceanTile(player));
        return undefined;
      }));
    } else if (availableMicrobeCards.length > 1) {
      availableActions.push(new SelectCard('Add 3 microbes to a card',
        'Add microbes',
        availableMicrobeCards, (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 3);
          LogHelper.logAddResource(player, foundCards[0], 3);
          player.game.defer(new PlaceOceanTile(player));
          return undefined;
        }));
    }

    if (availableAnimalCards.length === 1) {
      const targetAnimalCard = availableAnimalCards[0];
      availableActions.push(new SelectOption('Add 2 animals to ' + targetAnimalCard.name, 'Add animals', () => {
        player.addResourceTo(targetAnimalCard, 2);
        LogHelper.logAddResource(player, targetAnimalCard, 2);
        player.game.defer(new PlaceOceanTile(player));
        return undefined;
      }));
    } else if (availableAnimalCards.length > 1) {
      availableActions.push(new SelectCard('Add 2 animals to a card', 'Add animals', availableAnimalCards, (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], 2);
        LogHelper.logAddResource(player, foundCards[0], 2);
        player.game.defer(new PlaceOceanTile(player));
        return undefined;
      }));
    }

    return new OrOptions(...availableActions);
  }
}
