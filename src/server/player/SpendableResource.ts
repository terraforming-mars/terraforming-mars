import { Tag } from "../../common/cards/Tag";
import { ICard } from "../cards/ICard";
import { CardName } from "../../common/cards/CardName";
import { CardType } from "../../common/cards/CardType";
import { IPlayer } from "@/server/IPlayer";

/**
 * Every Spendable resource in the game currently has either a Tag related condition or a SP related condition.
 * The field "standardProjects" can either be a list of SPs or a boolean value of true indicating all SPs
 */
export type UseCondition = {
    tags?: Array<Tag>,
    standardProjects?: Array<CardName> | true
}

export type SpendingOption = {
    value: number,
    condition?: UseCondition
}

/**
 * Allows spending any field the player has access to as MC. Currently supports standard resources, card resources, and corruption
 * 
 * Could potentially be extended to allowing the spending of any resource as any other resource, but the only use case for this right now would be Stormcraft floaters
 */
export abstract class SpendableResource {

    /**
    * Resources can have multiple spending options with different conditions and values.
    * For example, by default you may spend titanium as 3MC for space cards, and Luna Trade Federation from the Moon expansion can spend titanium as 2MC unconditionally.
    * While this is the only exception to the pattern of one spending option per resource, this is implemented in this manner for maintainability
    */
    public spendingOptions: SpendingOption[] = [];

    constructor(
        public player: IPlayer
    ){}

    /**
     * Adds a new spending option for this resource, then sorts the list of options by value, ensuring more valuable spending options will always be considered before those of lesser value.
     * @param value The MC value of the spending option
     * @param condition the condition of the spending option
     */
    public AddSpendingOption(value: number, condition?: UseCondition) {
        this.spendingOptions.push({value: value, condition: condition});
        this.spendingOptions.sort((a, b) => a.value > b.value ? 1 : -1);
    }

    /**
     * Determines if a card meets the condition of a spending option. If no card is provided, the function simply returns if a condition exists
     * @param condition 
     * @param card 
     */
    public Condition(condition?: UseCondition, card?: ICard): boolean {
        let bool = false;
        if (condition === undefined) {
            bool = true;
        } else {
            if (card?.tags.some((tag) => condition.tags?.includes(tag)))
                bool = true;
            if (typeof condition.standardProjects === 'object') {
                condition.standardProjects.forEach((sp) => {
                    if (sp === card?.name)
                        bool = true;
                })
            } else {
                if (condition.standardProjects && card?.type === CardType.STANDARD_PROJECT) 
                    bool = true;
            }
        }
        return bool;
    }

    /**
     * Determines the best spending option for a given card. If no card is provided, the function simply returns the first unconditional option
     * @param card The card in question
     * @returns returns a spending option if any valid option exists
     */
    public GetValidSpendingOption(card?: ICard): SpendingOption | undefined {
        let returnOption;
        for (const option of this.spendingOptions) {
            if (this.Condition(option.condition, card)) {
                returnOption = option;
                break;
            }
        }
        return returnOption;
    }

    /**
     * Gets the value of the resource when spent on a specific card. If no card is provided, the function simply returns the value of the highest value unconditional spending option
     * @param card 
     * @returns 
     */
    public GetValue(card?: ICard): number {
        return this.GetValidSpendingOption(card)?.value ?? 0
    }

    /**
     * Gets the amount of resources availible when spent on a specific card. Cards may change the availible stock as they can have reserve units.
     * @param card 
     * @returns 
     */
    public abstract GetStock(card?: ICard): number

    /**
     * Deducts from the resource stock
     * @param amount 
     */
    public abstract DeductStock(amount: number): void

    /**
     * Gets the Generic type of resource. Used for adjusting for reserve units and telling the client what to render
     */
    public abstract get GetResourceType(): any

    /**
     * Gets the Unique name of the resource. Used for indexing PaymentOptions and Payment
     */
    public abstract get Name(): string
}