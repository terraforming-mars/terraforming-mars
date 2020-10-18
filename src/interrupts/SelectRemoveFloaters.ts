import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { SelectCard } from "../inputs/SelectCard";
import { ICard } from "../cards/ICard";
import { OrOptions } from "../inputs/OrOptions";
import { Resources } from "../Resources";
import { ResourceType } from "../ResourceType";
import { SelectOption } from "../inputs/SelectOption";

export class SelectRemoveFloaters implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = "Remove 2 floaters from a card or lose up to 10 MC"
    ){}

    public generatePlayerInput() {
        let floaterCards = this.player.getCardsWithResources().filter(card => card.resourceType === ResourceType.FLOATER 
            && card.resourceCount != undefined 
            && card.resourceCount >= 2);
        if (floaterCards.length === 0) {
            this.player.setResource(Resources.MEGACREDITS, -10, this.game, undefined, true);
            this.playerInput = undefined;
            return;
        } else {
            const selectAction = new OrOptions();
            const payMC = new SelectOption("Lose up to 10 MC", "Lose MC",() => {
                this.player.setResource(Resources.MEGACREDITS, -10);
                return undefined;
            });
            const removeFloaters = new SelectCard(
                "Select card to remove 2 floaters from", "Remove floaters", floaterCards,
                (foundCards: Array<ICard>) => {
                    this.player.removeResourceFrom(foundCards[0], 2);
                    return undefined;
                }
            );
            selectAction.options.push(payMC, removeFloaters);
            this.playerInput = selectAction;
        }
    }
}    
