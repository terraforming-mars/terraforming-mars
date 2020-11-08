import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { Game } from "../../Game";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";

export class FloaterTechnology implements IProjectCard {
    public cost = 7;
    public tags = [Tags.SCIENCE];
    public name = CardName.FLOATER_TECHNOLOGY;
    public cardType = CardType.ACTIVE;

    public canAct(player: Player): boolean {
        return player.getResourceCards(ResourceType.FLOATER).length > 0;
    } 

    public action(player: Player, game: Game) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);

        if (floaterCards.length) {
            game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 1));
        }

        return undefined;
    } 

    public play() {
        return undefined;
    }
}

