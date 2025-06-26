import {IPlayer} from '../../IPlayer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Phase} from '../../../common/Phase';
import {PolicyId} from '../../../common/turmoil/Types';
import {Resource} from '../../../common/Resource';
import {Space} from '../../boards/Space';
import {GREENS_POLICY_1} from './Greens';
import {PoliticalAgendas} from '../PoliticalAgendas';
import {Turmoil} from '../Turmoil';
import {CardName} from '../../../common/cards/CardName';

export class PartyHooks {
  static applyMarsFirstRulingPolicy(player: IPlayer, spaceType: SpaceType) {
    if (this.shouldApplyPolicy(player, PartyName.MARS, 'mp01') &&
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

  /**
   * Return true when `policy` is active.
   */
  static shouldApplyPolicy(player: IPlayer, partyName: PartyName, policyId: PolicyId): boolean {
    if (player.game.phase !== Phase.ACTION) {
      return false;
    }
    return Turmoil.ifTurmoilElse(player.game, (turmoil) => {
      // Hook for CEO Zan's effect (Skip all Reds Policy effects)
      if (partyName === PartyName.REDS && player.cardIsInEffect(CardName.ZAN)) {
        return false;
      }

      // Mars Alliance hook, always apply a policy when player is allied.
      // Reds policy is excluded as its passive effect is negative and its application is optional.
      const alliedPartyPolicy = player.alliedParty?.agenda.policyId;
      if (policyId === alliedPartyPolicy && player.alliedParty?.partyName !== PartyName.REDS) {
        return true;
      }
      const currentPolicyId = PoliticalAgendas.currentAgenda(turmoil).policyId;
      return turmoil.rulingParty.name === partyName && currentPolicyId === policyId;
    }, () => false);
  }
}
