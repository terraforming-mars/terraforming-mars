import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class VoteOfNoConfidence implements IProjectCard {
    public cost = 5;
    public tags = [];
    public name = CardName.VOTE_OF_NO_CONFIDENCE;
    public cardType = CardType.EVENT;

    public canPlay(player: Player): boolean {
      if (player.game.turmoil !== undefined) {
        if (!player.game.turmoil!.hasAvailableDelegates(player.id)) return false;

        const parties = player.game.turmoil.parties.filter((party) => party.partyLeader === player.id);
        const chairmanIsNeutral = player.game.turmoil.chairman === 'NEUTRAL';
        const hasPartyLeadership = parties.length > 0;

        if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
          return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST) && chairmanIsNeutral && hasPartyLeadership;
        }

        return chairmanIsNeutral && hasPartyLeadership;
      }
      return false;
    }

    public play(player: Player) {
      if (player.game.turmoil !== undefined) {
            player.game.turmoil.chairman! = player.id;
            const index = player.game.turmoil.delegateReserve.indexOf(player.id);
            if (index > -1) {
              player.game.turmoil.delegateReserve.splice(index, 1);
            }
            player.increaseTerraformRating();
      }
      return undefined;
    }
    public readonly requirements = CardRequirements.builder((b) => b.partyLeaders());
    public metadata: CardMetadata = {
      cardNumber: 'T16',
      renderData: CardRenderer.builder((b) => {
        b.minus().chairman().any.asterix();
        b.nbsp.plus().partyLeaders().br;
        b.tr(1);
      }),
      description: 'Requires that you have a Party Leader in any party and that the sitting Chairman is neutral. Remove the NEUTRAL Chairman and move your own delegate (from the reserve) there instead. Gain 1 TR.',
    }
}
