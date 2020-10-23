import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from "../../Game";
import { IResourceCard } from "../ICard";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";
import { TradeWithColony } from "../../deferredActions/TradeWithColony";

export class TitanFloatingLaunchPad implements IProjectCard,IResourceCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: CardName = CardName.TITAN_FLOATER_LAUNCHPAD;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(): boolean {
        return true;
    }

    public action(player: Player, game: Game) {
        let openColonies = game.colonies.filter(colony => colony.isActive && colony.visitor === undefined);

        if (this.resourceCount === 0 || openColonies.length === 0 || player.fleetSize <= player.tradesThisTurn) {
            game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 1, Tags.JOVIAN, "Add 1 floater to a Jovian card"));
            return undefined;
        }

        return new OrOptions(
            new SelectOption("Add 1 floater to a Jovian card", "Add floater", () => {
                game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 1, Tags.JOVIAN));
                return undefined;
            }),
            new SelectOption("Remove 1 floater on this card to trade for free", "Remove floater", () => {
                this.resourceCount--;
                game.defer(new TradeWithColony(player, game, openColonies, "Select colony to trade with for free")); 
                return undefined;
            })
        );
    }

    public play(player: Player, game: Game) {
        game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2, Tags.JOVIAN));
        return undefined;
    }

    public getVictoryPoints(): number {
        return 1;
    }
}
