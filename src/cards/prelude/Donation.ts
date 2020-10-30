import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";

export class Donation extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.DONATION;

    public play(player: Player) {     
        player.megaCredits += 21;
        return undefined;
    }
}

