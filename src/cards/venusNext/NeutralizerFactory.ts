import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';
import {Card} from '../Card';

export class NeutralizerFactory extends Card {
  constructor() {
    super({
      name: CardName.NEUTRALIZER_FACTORY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS],
      cost: 7,

      metadata: {
        cardNumber: '240',
        requirements: CardRequirements.builder((b) => b.venus(10)),
        renderData: CardRenderer.builder((b) => {
          b.venus(1);
        }),
        description: 'Requires Venus 10%. Increase the Venus track 1 step.',
      },
    });
  };

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
}
