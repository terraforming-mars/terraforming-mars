import { IParty } from "./IParty";
import { Party } from "./Party";
import { PartyName } from "./PartyName";
import { Game } from "../../Game";
import { Tags } from "../../cards/Tags";
import { Resources } from "../../Resources";

export class Unity extends Party implements IParty {
    public name = PartyName.UNITY;
    public description: string = "All players receive 1 MC for each Venus tag, Earth tag, and Jovian tag they have.";

    public rulingBonus(game: Game): void {
        game.getPlayers().forEach(player => {
            let tagCount = player.getTagCount(Tags.VENUS, false, false) + player.getTagCount(Tags.EARTH, false, false) + player.getTagCount(Tags.JOVIAN, false, false);
            player.setResource(Resources.MEGACREDITS, tagCount);
        });
    }
}
