import {IActionCard, ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class CaretakerContract implements IActionCard, IProjectCard {
    public cost = 3;
    public tags = [];
    public cardType = CardType.ACTIVE;
    public name = CardName.CARETAKER_CONTRACT;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= 0 - (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
      const hasEnoughHeat = player.heat >= 8 || (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) && (player.getResourcesOnCorporation() * 2) + player.heat >= 8);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughHeat;
      }

      return hasEnoughHeat;
    }
    public action(player: Player, game: Game) {
      if (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) && player.getResourcesOnCorporation() > 0 ) {
        let heatAmount: number;
        let floaterAmount: number;
        return new AndOptions(
          () => {
            if (
              heatAmount +
                (floaterAmount * 2) < 8
            ) {
              throw new Error('Need to pay 8 heat');
            }
            player.removeResourceFrom(player.corporationCard as ICard, floaterAmount);
            player.heat -= heatAmount;
            player.increaseTerraformRating(game);
            return undefined;
          },
          new SelectAmount('Select amount of heat to spend', 'Spend heat', (amount: number) => {
            heatAmount = amount;
            return undefined;
          }, player.heat),
          new SelectAmount('Select amount of floaters on corporation to spend', 'Spend floaters', (amount: number) => {
            floaterAmount = amount;
            return undefined;
          }, player.getResourcesOnCorporation()),
        );
      }
      player.heat -= 8;
      player.increaseTerraformRating(game);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '154',
      description: 'Requires 0° C or warmer.',
      requirements: CardRequirements.builder((b) => b.temperature(0)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.heat(8).startAction.tr(1);
          eb.description('Action: Spend 8 heat to increase your terraform rating 1 step.');
        });
      }),
    }
}
