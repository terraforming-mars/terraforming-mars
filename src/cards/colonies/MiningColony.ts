import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Resources } from "../../Resources";
import { BuildColony } from "../../deferredActions/BuildColony";

export class MiningColony implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.MINING_COLONY;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        game.defer(new BuildColony(player, game, false, "Select colony for Mining Colony"));
        player.addProduction(Resources.TITANIUM); 
        return undefined;
    }
}
