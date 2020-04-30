import { IParty } from "./IParty";
import { Party } from "./Party";
import { PartyName } from "./PartyName";
import { Game } from "../../Game";
import { Resources } from "../../Resources";

export class Kelvinists extends Party implements IParty {
    public name = PartyName.KELVINISTS;
    public description: string = "All players receive 1 MC for each Heat production they have.";

    public rulingBonus(game: Game): void {
        game.getPlayers().forEach(player => {
            let heatProduction = player.getProduction(Resources.HEAT);
            player.setResource(Resources.MEGACREDITS, heatProduction);
        });
    }
}
