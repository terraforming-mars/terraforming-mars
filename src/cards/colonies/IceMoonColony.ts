import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { BuildColony } from "../../deferredActions/BuildColony";
import { PlaceOceanTile } from "../../deferredActions/PlaceOceanTile";

export class IceMoonColony implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.ICE_MOON_COLONY;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        game.defer(new BuildColony(player, game, false, "Select colony for Ice Moon Colony"));
        game.defer(new PlaceOceanTile(player, game, "Select ocean for Ice Moon Colony"));
        return undefined;
    }
}
