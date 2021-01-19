import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class GiantSolarShade implements IProjectCard {
    public cost = 27;
    public tags = [Tags.SPACE, Tags.VENUS];
    public name = CardName.GIANT_SOLAR_SHADE;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      const remainingVenusSteps = (MAX_VENUS_SCALE - game.getVenusScaleLevel()) / 2;
      const stepsRaised = Math.min(remainingVenusSteps, 3);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised, game, false, true, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      return game.increaseVenusScaleLevel(player, 3);
    }
    public metadata: CardMetadata = {
      cardNumber: '229',
      renderData: CardRenderer.builder((b) => b.venus(3)),
      description: 'Raise Venus 3 steps.',
    };
}

