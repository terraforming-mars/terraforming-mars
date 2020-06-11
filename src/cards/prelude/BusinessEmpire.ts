import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';
import { Game } from "../../Game";
import { CorporationName } from "../../CorporationName";

export class BusinessEmpire extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.BUSINESS_EMPIRE;
    public canPlay(player: Player, _game: Game, bonusMc?: number) {
        let requiredPayment = 6 - (bonusMc || 0);
        if (player.isCorporation(CorporationName.MANUTECH)) return requiredPayment - 6 <= 0;
        
        return requiredPayment <= 0 ? true : player.canAfford(requiredPayment);
    }
    public play(player: Player) {
	    player.megaCredits -= 6;
        player.setProduction(Resources.MEGACREDITS,6);
        return undefined;
    }
}

