import {Player} from '../../Player';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Phase} from '../../../common/Phase';
import {PolicyId} from '../Policy';
import {Resources} from '../../../common/Resources';
import {ISpace} from '../../boards/ISpace';
import {GREENS_POLICY_1} from './Greens';
import {PoliticalAgendas} from '../PoliticalAgendas';
import {Turmoil} from '../Turmoil';

export class PartyHooks {
  static applyMarsFirstRulingPolicy(player: Player, spaceType: SpaceType) {
    if (this.shouldApplyPolicy(player, PartyName.MARS, 'mfp01') &&
        spaceType !== SpaceType.COLONY) {
      player.addResource(Resources.STEEL, 1);
    }
  }

  static applyGreensRulingPolicy(player: Player, space: ISpace) {
    if (this.shouldApplyPolicy(player, PartyName.GREENS, 'gp01')) {
      const greensPolicy = GREENS_POLICY_1;
      greensPolicy.onTilePlaced(player, space);
    }
  }

  // Return true when the supplied policy is active. When `policyId` is inactive, it selects
  // the default policy for `partyName`.
  static shouldApplyPolicy(player: Player, partyName: PartyName, policyId?: PolicyId): boolean {
    const game = player.game;
    return Turmoil.ifTurmoilElse(game, (turmoil) => {
      if (game.phase !== Phase.ACTION) return false;

      const rulingParty = turmoil.rulingParty;

      // Set the default policy if not given
      if (policyId === undefined) {
        policyId = rulingParty.policies[0].id;
      }

      const currentPolicyId: PolicyId = PoliticalAgendas.currentAgenda(turmoil).policyId;

      return rulingParty.name === partyName && currentPolicyId === policyId;
    }, () => false);
  }
}
