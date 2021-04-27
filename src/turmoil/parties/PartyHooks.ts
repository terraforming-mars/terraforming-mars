import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from './PartyName';
import {SpaceType} from '../../SpaceType';
import {Phase} from '../../Phase';
import {PolicyId} from '../Policy';
import {Resources} from '../../Resources';
import {ISpace} from '../../boards/ISpace';
import {GREENS_POLICY_1} from './Greens';
import {TurmoilPolicy} from '../TurmoilPolicy';
import {PoliticalAgendas} from '../PoliticalAgendas';

export class PartyHooks {
  static applyMarsFirstRulingPolicy(player: Player, spaceType: SpaceType) {
    if (this.shouldApplyPolicy(player.game, PartyName.MARS, TurmoilPolicy.MARS_FIRST_DEFAULT_POLICY) &&
        spaceType !== SpaceType.COLONY) {
      player.addResource(Resources.STEEL, 1);
    }
  }

  static applyGreensRulingPolicy(player: Player, space: ISpace) {
    if (this.shouldApplyPolicy(player.game, PartyName.GREENS, TurmoilPolicy.GREENS_DEFAULT_POLICY)) {
      const greensPolicy = GREENS_POLICY_1;
      greensPolicy.onTilePlaced(player, space);
    }
  }

  // Return true when the supplied policy is active. When `policyId` is inactive, it selects
  // the default policy for `partyName`.
  static shouldApplyPolicy(game: Game, partyName: PartyName, policyId?: PolicyId): boolean {
    if (!game.gameOptions.turmoilExtension) return false;

    if (game.phase !== Phase.ACTION) return false;

    const turmoil = game.turmoil!;
    if (!turmoil) return false;

    const rulingParty = turmoil.rulingParty;
    if (rulingParty === undefined) return false;

    // Set the default policy if not given
    if (policyId === undefined) {
      policyId = rulingParty.policies[0].id;
    }

    const currentPolicyId: PolicyId = (turmoil.politicalAgendasData === undefined) ?
      rulingParty.policies[0].id :
      PoliticalAgendas.currentAgenda(turmoil).policyId;

    return rulingParty.name === partyName && currentPolicyId === policyId;
  }
}
