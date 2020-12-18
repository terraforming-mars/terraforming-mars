import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ReleaseOfInertGases implements IProjectCard {
    public cost = 14;
    public tags = [];
    public name = CardName.RELEASE_OF_INERT_GASES;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 2);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRatingSteps(2, game);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '036',
      renderData: CardRenderer.builder((b) => {
        b.tr(2);
      }),
      description: 'Raise your terraforming rating 2 steps.',
    }
}
