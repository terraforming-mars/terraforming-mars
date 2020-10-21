import { Game } from "../Game";
import { Player } from "../Player";
import { SelectCard } from "../inputs/SelectCard";
import { ResourceType } from "../ResourceType";
import { ICard } from "../cards/ICard";
import { LogHelper } from "../components/LogHelper";
import { Tags } from "../cards/Tags";
import { DeferredAction } from "./DeferredAction";

export class AddResourcesToCard implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game,
        public resourceType: ResourceType | undefined,
        public count: number = 1,
        public restrictedTag?: Tags,
        public title: string = "Select card to add " + count + " " + resourceType + "(s)"
    ){}

    public execute() {
        let resourceCards = this.player.getResourceCards(this.resourceType);

        if (this.restrictedTag !== undefined) {
            resourceCards = resourceCards.filter(card => card.tags.indexOf(this.restrictedTag!) !== -1);
        }

        if (resourceCards.length === 0) {
            return undefined;
        }

        if (resourceCards.length === 1) {
            this.player.addResourceTo(resourceCards[0], this.count);
            LogHelper.logAddResource(this.game, this.player, resourceCards[0], this.count);
            return undefined;
        }

        return new SelectCard(
            this.title,
            "Add resource(s)",
            resourceCards,
            (foundCards: Array<ICard>) => {
                this.player.addResourceTo(foundCards[0], this.count);
                LogHelper.logAddResource(this.game, this.player, foundCards[0], this.count);
                return undefined;
            }
        );
    }
}    
