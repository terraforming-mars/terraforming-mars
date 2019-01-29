
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { ICard } from "../ICard";

export abstract class CorporationCard implements ICard {
    public abstract tags: Array<Tags>;
    public abstract name: string;
    public abstract description: string;
    public abstract text: string;
    public abstract startingMegaCredits: number;
    public skipInitialResearch: boolean = false;
    public abstract play(player: Player, game: Game): Promise<void>;
}
