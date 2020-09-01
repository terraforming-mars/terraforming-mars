import { Player } from "../../Player";
import { Game } from '../../Game';
import { PartyName } from "./PartyName";
import { SpaceType } from "../../SpaceType";
import { Phase } from "../../Phase";
import { Resources } from "../../Resources";

export class PartyHooks {
    static applyMarsFirstRulingPolicy(game: Game, player: Player, spaceType: SpaceType, isWorldGov: boolean) {
        if (this.shouldApplyPolicy(game, PartyName.MARS)
        && spaceType !== SpaceType.COLONY
        && game.phase === Phase.ACTION
        && !isWorldGov) {
          player.setResource(Resources.STEEL, 1);
        }
    }

    static applyGreensRulingPolicy(game: Game, player: Player) {
        if (this.shouldApplyPolicy(game, PartyName.GREENS) && game.phase === Phase.ACTION) {
            player.setResource(Resources.MEGACREDITS, 4);
        }
    }

    static shouldApplyPolicy(game: Game, partyName: PartyName) {
        if (!game.turmoilExtension) return false;

        const turmoil = game.turmoil!;
        if (!turmoil) return false;

        const rulingParty = turmoil.rulingParty!;
        if (!rulingParty) return false;

        return rulingParty.name === partyName;
    }
}