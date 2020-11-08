import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { RemoveAnyPlants } from "../../deferredActions/RemoveAnyPlants";

export class ImpactorSwarm implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SPACE];
    public name = CardName.IMPACTOR_SWARM;
    public cardType = CardType.EVENT;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.JOVIAN) >= 2;
    }

    public play(player: Player, game: Game) {
        game.defer(new RemoveAnyPlants(player, game, 2));
        player.heat += 12;
        return undefined;
    }
}
