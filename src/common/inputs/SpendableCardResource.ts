import { IPlayer } from "../../server/IPlayer";
import { CardResource } from "../CardResource";
import { SpendableResource } from "./SpendableResource";
import { ICard } from "../../server/cards/ICard";

/**
 * Allows the spending of card resources as MC.
 */
export class SpendableCardResource extends SpendableResource {

    /**
     * The resource card the player draws from
     */
    public resourceCard: ICard; 

    constructor(card: ICard, player: IPlayer){
        super(player);
        this.resourceCard = card;
    }
    
    public override GetStock(card?: ICard): number {
        let stock = this.resourceCard.resourceCount;
        // adjust based on reserve units ONLY IF this card is the only card of this resource type with resources.
        if (this.player.getResourceCount(this.GetResourceType) === stock) {
            stock -= card?.reserveUnits[this.GetResourceType] ?? 0
        }
        return stock;
    }

    public override DeductStock(amount: number): undefined {
        this.resourceCard.resourceCount -= amount;
    }

    public override get GetResourceType(): CardResource {
        if (this.resourceCard.resourceType !== undefined) {
            return this.resourceCard.resourceType
        } else {
            throw new Error('Spending Options referneces a card that does not contain resources.')
        }
    }

    public override get Name(): string {
        return `${this.resourceCard.name} ${this.GetResourceType}`
    }
}