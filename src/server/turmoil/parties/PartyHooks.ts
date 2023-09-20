import {IPlayer} from '../../IPlayer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Phase} from '../../../common/Phase';
import {PolicyId} from '../Policy';
import {Resource} from '../../../common/Resource';
import {Space} from '../../boards/Space';
import {GREENS_POLICY_1} from './Greens';
import {PoliticalAgendas} from '../PoliticalAgendas';
import {Turmoil} from '../Turmoil';
import {CardName} from '../../../common/cards/CardName';

export class PartyHooks {
  static applyMarsFirstRulingPolicy(player: IPlayer, spaceType: SpaceType) {
    if (this.shouldApplyPolicy(player, PartyName.MARS, 'mfp01') &&
        spaceType !== SpaceType.COLONY) {
      player.stock.add(Resource.STEEL, 1);
    }
  }

  static applyGreensRulingPolicy(player: IPlayer, space: Space) {
    if (this.shouldApplyPolicy(player, PartyName.GREENS, 'gp01')) {
      const greensPolicy = GREENS_POLICY_1;
      greensPolicy.onTilePlaced(player, space);
    }
  }

  // Return true when the supplied policy is active. When `policyId` is inactive, it selects
  // the default policy for `partyName`.
  static shouldApplyPolicy(player: IPlayer, partyName: PartyName, policyId?: PolicyId): boolean {
    const game = player.game;
    return Turmoil.ifTurmoilElse(game, (turmoil) => {
      if (game.phase !== Phase.ACTION) return false;

      const rulingParty = turmoil.rulingParty;

      // Set the default policy if not given
      if (policyId === undefined) {
        policyId = rulingParty.policies[0].id;
      }

      // Hook for CEO Zan's effect (Skip all Reds Policy effects)
      if (partyName === PartyName.REDS && player.cardIsInEffect(CardName.ZAN)) return false;

      const currentPolicyId: PolicyId = PoliticalAgendas.currentAgenda(turmoil).policyId;

      return rulingParty.name === partyName && currentPolicyId === policyId;
    }, () => false);
  }
}
