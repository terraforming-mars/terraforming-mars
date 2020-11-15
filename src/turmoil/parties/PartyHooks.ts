import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from './PartyName';
import {SpaceType} from '../../SpaceType';
import {Phase} from '../../Phase';
import {Resources} from '../../Resources';

export class PartyHooks {
  static applyMarsFirstRulingPolicy(game: Game, player: Player, spaceType: SpaceType) {
    if (this.shouldApplyPolicy(game, PartyName.MARS) &&
        spaceType !== SpaceType.COLONY &&
        game.phase === Phase.ACTION) {
      player.setResource(Resources.STEEL, 1);
    }
  }

  static applyGreensRulingPolicy(game: Game, player: Player) {
    if (this.shouldApplyPolicy(game, PartyName.GREENS) && game.phase === Phase.ACTION) {
      player.setResource(Resources.MEGACREDITS, 4);
    }
  }

  static shouldApplyPolicy(game: Game, partyName: PartyName, policyID?: string) {
    if (!game.gameOptions.turmoilExtension) return false;

    const turmoil = game.turmoil!;
    if (!turmoil) return false;

    const rulingParty = turmoil.rulingParty!;
    if (!rulingParty) return false;

    if (policyID !== undefined && rulingParty.activePolicy !== undefined) {
      return rulingParty.name === partyName && rulingParty.activePolicy.id === policyID;
    }

    return rulingParty.name === partyName;
  }
}
