import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Game } from "../../Game";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { BuildColony } from "../../deferredActions/BuildColony";

export class Poseidon implements CorporationCard {
    public name: CardName =  CardName.POSEIDON;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 45;
    public cardType: CardType = CardType.CORPORATION;

    public initialAction(player: Player, game: Game) {
        if (game.gameOptions.coloniesExtension) {
            game.defer(new BuildColony(player, game, false, "Poseidon first action - Select where to build colony"));
            return undefined;
        } else {
            console.warn("Colonies extension isn't selected.");
            return undefined;
        }
    }

    public play() {
        return undefined;
    }


}
