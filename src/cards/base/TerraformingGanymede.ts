import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {LogHelper} from '../../components/LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TerraformingGanymede implements IProjectCard {
    public cost = 33;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.TERRAFORMING_GANYMEDE;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const steps = 1 + player.getTagCount(Tags.JOVIAN);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * steps, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      const steps = 1 + player.getTagCount(Tags.JOVIAN);
      player.increaseTerraformRatingSteps(steps, game);
      LogHelper.logTRIncrease(game, player, steps);

      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      cardNumber: '197',
      renderData: CardRenderer.builder((b) => {
        b.tr(1).slash().jovian().played;
      }),
      description: 'Raise your TR 1 step for each Jovian tag you have, including this.',
      victoryPoints: 2,
    }
}
