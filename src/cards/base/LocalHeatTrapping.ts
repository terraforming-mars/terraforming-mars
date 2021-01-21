import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {ResourceType} from '../../ResourceType';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';

export class LocalHeatTrapping extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.LOCAL_HEAT_TRAPPING,
      cost: 1,

      metadata: {
        cardNumber: '190',
        renderData: CardRenderer.builder((b) => {
          b.minus().heat(5).digit;
          b.plus().plants(4).digit;
          b.or().animals(2).digit.asterix();
        }),
        description: 'Spend 5 heat to gain either 4 Plants, or to add 2 Animals to ANOTHER card.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    const requiredHeatAmt = 5;

    // Helion must be able to pay for both the card and its effect
    if (player.canUseHeatAsMegaCredits) {
      return (player.heat >= requiredHeatAmt) && (player.heat + player.megaCredits >= requiredHeatAmt + player.getCardCost(this));
    }

    return player.availableHeat >= requiredHeatAmt;
  }
  public play(player: Player) {
    const animalCards: Array<ICard> = player.getResourceCards(ResourceType.ANIMAL);
    const availableActions = new OrOptions();

    const gain4Plants = function() {
      player.plants += 4;
      LogHelper.logGainStandardResource(player, Resources.PLANTS, 4);
      return undefined;
    };
    if (animalCards.length === 0) {
      availableActions.options.push(new SelectOption('Gain 4 plants', 'Gain plants', gain4Plants));
    } else if (animalCards.length === 1) {
      const targetCard = animalCards[0];
      availableActions.options.push(
        new SelectOption('Gain 4 plants', 'Gain plants', gain4Plants),
        new SelectOption('Add 2 animals to ' + targetCard.name, 'Add animals', () => {
          player.addResourceTo(targetCard, 2);
          LogHelper.logAddResource(player, targetCard, 2);
          return undefined;
        }));
    } else {
      availableActions.options.push(
        new SelectOption('Gain 4 plants', 'Gain plants', gain4Plants),
        new SelectCard('Select card to add 2 animals', 'Add animals', animalCards, (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 2);
          LogHelper.logAddResource(player, foundCards[0], 2);
          return undefined;
        }));
    }

    return player.spendHeat(5, () => {
      if (availableActions.options.length === 1) return availableActions.options[0].cb();
      return availableActions;
    });
  }
}
