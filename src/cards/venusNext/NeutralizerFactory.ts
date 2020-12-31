import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
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
import {GlobalParameter} from '../../GlobalParameter';

export class NeutralizerFactory implements IProjectCard {
    public cost = 7;
    public tags = [Tags.VENUS];
    public name = CardName.NEUTRALIZER_FACTORY;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      const venusRequirementMet = game.checkMinRequirements(player, GlobalParameter.VENUS, 10);
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, false, true) && venusRequirementMet;
      }

      return venusRequirementMet;
    }

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '240',
      requirements: CardRequirements.builder((b) => b.venus(10)),
      renderData: CardRenderer.builder((b) => {
        b.venus(1);
      }),
      description: 'Requires Venus 10%. Increase the Venus track 1 step.',
    }
}
