import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { SelectCard } from "../inputs/SelectCard";
import { ResourceType } from "../ResourceType";
import { ICard } from "../cards/ICard";
import { LogHelper } from "../components/LogHelper";
import { CardName } from "../CardName";
import { Tags } from "../cards/Tags";

export class SelectResourceCard implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public resourceType: ResourceType,
        public title: string | undefined,
        public count: number = 1,
        public restrictedTag: Tags | undefined,
        private invalidCards: Array<CardName>,
    ){}

    public generatePlayerInput() {
        let resourceCards: Array<ICard> = this.player.getResourceCards(this.resourceType);

        if (this.restrictedTag !== undefined) {
            resourceCards = resourceCards.filter(card => card.tags.indexOf(this.restrictedTag!) !== -1);
        }
        if (this.invalidCards.length > 0) {
            resourceCards = resourceCards.filter(card => this.invalidCards.indexOf(card.name) === -1);
        }
        if (resourceCards.length === 0) {
            this.playerInput = undefined;
            return;
        }

        if (resourceCards.length === 1) {
            this.player.addResourceTo(resourceCards[0], this.count);
            LogHelper.logAddResource(this.game, this.player, resourceCards[0], this.count);
            this.playerInput = undefined;
            return;
        }

        if (this.title === undefined) {
            this.title = "Select card to add " + this.count + " " + this.resourceType + " resource(s)";
        }
        this.playerInput = new SelectCard(
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
