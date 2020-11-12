import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {CardName} from '../CardName';
import {Game} from '../Game';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../constants';

export class BribedCommittee implements IProjectCard {
    public cost = 7;
    public tags = [Tags.EARTH];
    public cardType = CardType.EVENT;
    public name = CardName.BRIBED_COMMITTEE;
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

    public getVictoryPoints() {
      return -2;
    }
}
