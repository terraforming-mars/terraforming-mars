import * as constants from '../../constants';
import {CorporationCard} from '../corporation/CorporationCard';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {ICard, IActionCard, IResourceCard} from '../ICard';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class StormCraftIncorporated implements IActionCard, CorporationCard, IResourceCard {
  public name = CardName.STORMCRAFT_INCORPORATED;
  public tags = [Tags.JOVIAN];
  public startingMegaCredits: number = 48;
  public resourceType = ResourceType.FLOATER;
  public resourceCount: number = 0;
  public cardType = CardType.CORPORATION;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const floaterCards = player.getResourceCards(ResourceType.FLOATER);
    if (floaterCards.length === 1) {
      this.resourceCount++;
      return undefined;
    }

    return new SelectCard(
        'Select card to add 1 floater',
        'Add floater',
        floaterCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 1);
          return undefined;
        },
    );
  }

  public convertHeatIntoTemperature(game: Game, player: Player): SelectOption {
    const floatersToHeat = 2;
    let heatAmount: number;
    let floaterAmount: number;
    const raiseTempOptions = new AndOptions(
        () => {
          const total = heatAmount + (floaterAmount * floatersToHeat);
          if (total < constants.HEAT_FOR_TEMPERATURE) {
            throw new Error(`Need to pay ${constants.HEAT_FOR_TEMPERATURE} heat`);
          }
          if (total > constants.HEAT_FOR_TEMPERATURE) {
            throw new Error(`Only need to pay ${constants.HEAT_FOR_TEMPERATURE} heat`);
          }
          player.removeResourceFrom(this, floaterAmount);
          player.heat -= heatAmount;
          game.increaseTemperature(player, 1);
          game.log('${0} converted heat into temperature', (b) => b.player(player));
          return undefined;
        },
        new SelectAmount('Select amount of heat to spend', 'Spend heat', (amount: number) => {
          heatAmount = amount;
          return undefined;
        }, Math.min(player.heat, constants.HEAT_FOR_TEMPERATURE)),
        new SelectAmount('Select amount of floaters on corporation to spend', 'Spend floaters', (amount: number) => {
          floaterAmount = amount;
          return undefined;
        }, Math.min(this.resourceCount, constants.HEAT_FOR_TEMPERATURE / floatersToHeat)),
    );
    raiseTempOptions.title = 'Select resource amounts to raise temp';

    return new SelectOption(`Convert ${constants.HEAT_FOR_TEMPERATURE} heat into temperature`, 'Convert heat', () => {
      return raiseTempOptions;
    });
  }
}
