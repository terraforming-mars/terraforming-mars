import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class JovianEmbassy implements IProjectCard {
    public cost = 14;
    public tags = [Tags.JOVIAN, Tags.BUILDING];
    public name = CardName.JOVIAN_EMBASSY;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X24',
      renderData: CardRenderer.builder((b) => {
        b.tr(1);
      }),
      description: 'Raise your TR 1 step.',
      victoryPoints: 1,
    };
}
