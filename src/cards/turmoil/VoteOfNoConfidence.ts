import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';

export class VoteOfNoConfidence implements IProjectCard {
    public cost = 5;
    public tags = [];
    public name = CardName.VOTE_OF_NO_CONFIDENCE;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        if (!game.turmoil!.hasAvailableDelegates(player.id)) return false;

        const parties = game.turmoil.parties.filter((party) => party.partyLeader === player.id);
        const chairmanIsNeutral = game.turmoil.chairman === 'NEUTRAL';
        const hasPartyLeadership = parties.length > 0;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST) && chairmanIsNeutral && hasPartyLeadership;
        }

        return chairmanIsNeutral && hasPartyLeadership;
      }
      return false;
    }

    public play(player: Player, game: Game) {
      if (game.turmoil !== undefined) {
            game.turmoil.chairman! = player.id;
            const index = game.turmoil.delegate_reserve.indexOf(player.id);
            if (index > -1) {
              game.turmoil.delegate_reserve.splice(index, 1);
            }
            player.increaseTerraformRating(game);
      }
      return undefined;
    }
}
