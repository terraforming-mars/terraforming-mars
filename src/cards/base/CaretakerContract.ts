import {IActionCard, ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class CaretakerContract extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.CARETAKER_CONTRACT,
      cost: 3,

      metadata: {
        cardNumber: '154',
        description: 'Requires 0° C or warmer.',
        requirements: CardRequirements.builder((b) => b.temperature(0)),
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 8 heat to increase your terraform rating 1 step.', (eb) => {
            eb.heat(8).startAction.tr(1);
          });
        }),
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, 0);
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
        }, 0, player.heat),
        new SelectAmount('Select amount of floaters on corporation to spend', 'Spend floaters', (amount: number) => {
          floaterAmount = amount;
          return undefined;
        }, 0, player.getResourcesOnCorporation()),
      );
    }
    player.heat -= 8;
    player.increaseTerraformRating(game);
    return undefined;
  }
}
