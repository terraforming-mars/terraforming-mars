import { IPlayer } from "../../server/IPlayer";
import { SpendableResource } from "./SpendableResource";
import { Resource } from "../Resource";
import { ICard } from "../../server/cards/ICard";

/**
 * Allows the spending of standard resources as MC.
 */
export class SpendableStandardResource extends SpendableResource {

    /**
     * The standard resource in question
     */
    public resource: Resource; 

    constructor(standardResource: Resource, player: IPlayer){
        super(player);
        this.resource = standardResource;
    }
    
    public override GetStock(card?: ICard): number {
        let stock = this.player.stock.get(this.resource);
        stock -= card?.reserveUnits[this.resource] ?? 0;
        return stock
    }

    public override DeductStock(amount: number): undefined {
        this.player.stock.deduct(this.resource, amount)
    }

    public override GetValue(card?: ICard): number {
        let caluclatedValue = super.GetValue(card);
        // There is probably a better way to implement this. This is good enough tho.
        if (this.resource === Resource.STEEL) {
            caluclatedValue += this.player.steelValueBonus;
        }
        if (this.resource === Resource.TITANIUM) {
            caluclatedValue += this.player.titaniumValueBonus;
        }
        return caluclatedValue
    }

    public override get GetResourceType(): Resource {
        return this.resource;
    }

    public override get Name(): string {
        return this.resource;
    }
}