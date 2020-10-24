import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from "../../Game";
import { SelectAmount } from "../../inputs/SelectAmount";
import { IResourceCard } from "../ICard";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";

export class TitanShuttles implements IProjectCard, IResourceCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.TITAN_SHUTTLES;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(): boolean {
        return true;
    }

    public action(player: Player, game: Game) {
        if (this.resourceCount === 0) {
            game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2, Tags.JOVIAN, "Add 2 floaters to a Jovian card"));
            return undefined;
        }

        return new OrOptions(
            new SelectOption("Add 2 floaters to a Jovian card", "Add floaters", () => {
                game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2, Tags.JOVIAN));
                return undefined;
            }),
            new SelectAmount("Remove X floaters on this card to gain X titanium", "Remove floaters", (amount: number) => {
                player.removeResourceFrom(this, amount);
                player.titanium += amount; 
                return undefined;
            }, this.resourceCount)
        );
    }

    public play() {
        return undefined;
    }

    public getVictoryPoints(): number {
        return 1;
    }
}
