import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { Game } from "../../Game";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";

export class FloaterPrototypes implements IProjectCard {
    public cost = 2;
    public tags = [Tags.SCIENCE];
    public name = CardName.FLOATER_PROTOTYPES;
    public cardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2));
        return undefined;
    }
}

