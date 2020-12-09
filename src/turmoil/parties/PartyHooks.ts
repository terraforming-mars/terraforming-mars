import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from './PartyName';
import {SpaceType} from '../../SpaceType';
import {Phase} from '../../Phase';
import {PolicyId} from '../Policy';
import {Resources} from '../../Resources';
import {Agenda} from '../PoliticalAgendas';
import {ISpace} from '../../ISpace';
import {GreensPolicy01} from './Greens';

export class PartyHooks {
  static applyMarsFirstRulingPolicy(game: Game, player: Player, spaceType: SpaceType) {
    if (this.shouldApplyPolicy(game, PartyName.MARS, 'mfp01') &&
        spaceType !== SpaceType.COLONY &&
        game.phase === Phase.ACTION) {
      player.setResource(Resources.STEEL, 1);
    }
  }

  static applyGreensRulingPolicy(game: Game, player: Player, space: ISpace) {
    if (this.shouldApplyPolicy(game, PartyName.GREENS, 'gp01')) {
      const greensPolicy = new GreensPolicy01();
      greensPolicy.onTilePlaced(player, space, game);
    }
  }

  static shouldApplyPolicy(game: Game, partyName: PartyName, policyId?: PolicyId) {
    if (!game.gameOptions.turmoilExtension) return false;

    const turmoil = game.turmoil!;
    if (!turmoil) return false;

    const rulingParty = turmoil.rulingParty!;
    if (!rulingParty) return false;

    // Set the default policy if not given
    if (policyId === undefined) policyId = rulingParty.policies[0].id;

    // Apply the chosen policy
    const staticAgendas: Map<PartyName, Agenda> = turmoil.politicalAgendasData.staticAgendas as Map<PartyName, Agenda>;
    const partyAgenda = staticAgendas.get(partyName) as Agenda;

    return rulingParty.name === partyName && partyAgenda.policyId === policyId;
  }
}
