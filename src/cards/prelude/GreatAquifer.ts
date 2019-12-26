import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { SelectSpace } from "../../inputs/SelectSpace";
import { IceAsteroid } from "../IceAsteroid";

export class GreatAquifer extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Great Aquifer";
    public play: (player: Player, game: Game) => SelectSpace | undefined = IceAsteroid.placeTwoOceans;
}

