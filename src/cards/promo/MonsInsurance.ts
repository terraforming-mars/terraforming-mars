import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { CorporationName } from '../../CorporationName';
import { Game } from '../../Game'
import { Resources } from '../../Resources';

export class MonsInsurance implements CorporationCard {
    public name: string = CorporationName.MONS_INSURANCE;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 48;

    public play(player: Player, game: Game) {
        player.setProduction(Resources.MEGACREDITS,6);
        for (let player of game.getPlayers()) {
            player.setProduction(Resources.MEGACREDITS,-2);
        }
        game.monsInsuranceOwner = player;
        return undefined;
    }
}    