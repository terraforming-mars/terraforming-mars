import { IParty } from "./IParty";
import { Party } from "./Party";
import { PartyName } from "./PartyName";
import { Game } from "../../Game";
import { Tags } from "../../cards/Tags";
import { Resources } from "../../Resources";

export class Greens extends Party implements IParty {
    public name = PartyName.GREENS;
    public description: string = "All players receive 1 MC for each Plant tag, Microbe tag, and Animal tag they have.";

    public rulingBonus(game: Game): void {
        game.getPlayers().forEach(player => {
            let tagCount = player.getTagCount(Tags.PLANT, false, false) + player.getTagCount(Tags.MICROBES, false, false) + player.getTagCount(Tags.ANIMAL, false, false);
            player.setResource(Resources.MEGACREDITS, tagCount);
        });
    }
}
