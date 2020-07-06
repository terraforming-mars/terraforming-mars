import { IParty } from "./IParty";
import { Party } from "./Party";
import { PartyName } from "./PartyName";
import { Game } from "../../Game";
import { Tags } from "../../cards/Tags";
import { Resources } from "../../Resources";

export class Scientists extends Party implements IParty {
    public name = PartyName.SCIENTISTS;
    public description: string = "All players receive 1 MC for each Science tag they have.";

    public rulingBonus(game: Game): void {
        game.getPlayers().forEach(player => {
            let tagCount = player.getTagCount(Tags.SCIENCE, false, false);
            player.setResource(Resources.MEGACREDITS, tagCount);
        });
    }
}
