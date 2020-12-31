import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
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
      const hasEnoughHeat = player.availableHeat >= 8;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughHeat;
      }

      return hasEnoughHeat;
    }
    public action(player: Player, game: Game) {
      return player.spendHeat(8, () => {
        player.increaseTerraformRating(game);
        return undefined;
      });
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
