import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {ResourceType} from '../../ResourceType';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {LogHelper} from '../../components/LogHelper';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class LocalHeatTrapping implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 1;
    public tags = [];
    public name = CardName.LOCAL_HEAT_TRAPPING;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
      const requiredHeatAmt = 5;

      // Helion must be able to pay for both the card and its effect
      if (player.canUseHeatAsMegaCredits) {
        return (player.heat >= requiredHeatAmt) && (player.heat + player.megaCredits >= requiredHeatAmt + player.getCardCost(game, this));
      };

      return player.heat >= requiredHeatAmt || (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) && (player.getResourcesOnCorporation() * 2) + player.heat >= 5 );
    }
    public play(player: Player, game: Game) {
      const animalCards: Array<ICard> = player.getResourceCards(ResourceType.ANIMAL);
      const availableActions = new OrOptions();

      const gain4Plants = function() {
        player.plants += 4;
        LogHelper.logGainStandardResource(game, player, Resources.PLANTS, 4);
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
            LogHelper.logAddResource(game, player, targetCard, 2);
            return undefined;
          }));
      } else {
        availableActions.options.push(
          new SelectOption('Gain 4 plants', 'Gain plants', gain4Plants),
          new SelectCard('Select card to add 2 animals', 'Add animals', animalCards, (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0], 2);
            LogHelper.logAddResource(game, player, foundCards[0], 2);
            return undefined;
          }));
      };

      if (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) &&
          player.getResourcesOnCorporation() > 0) {
        let heatAmount: number;
        let floaterAmount: number;
        return new AndOptions(
          () => {
            if (
              heatAmount +
                    (floaterAmount * 2) < 5
            ) {
              throw new Error('Need to pay 5 heat');
            }
            player.removeResourceFrom(player.corporationCard as ICard, floaterAmount);
            player.heat -= heatAmount;

            if (availableActions.options.length === 1) return availableActions.options[0].cb();
            return availableActions;
          },
          new SelectAmount('Select amount of heat to spend', 'Spend heat', (amount: number) => {
            heatAmount = amount;
            return undefined;
          }, 0, player.heat),
          new SelectAmount('Select amount of floaters on corporation to spend', 'Spend floaters', (amount: number) => {
            floaterAmount = amount;
            return undefined;
          }, 0, player.getResourcesOnCorporation()),

        );
      }

      player.heat -= 5;

      if (availableActions.options.length === 1) return availableActions.options[0].cb();
      return availableActions;
    }
    public metadata: CardMetadata = {
      cardNumber: '190',
      renderData: CardRenderer.builder((b) => {
        b.minus().heat(5).digit;
        b.plus().plants(4).digit;
        b.or().animals(2).digit.asterix();
      }),
      description: 'Spend 5 heat to gain either 4 Plants, or to add 2 Animals to ANOTHER card.',
    };
}
