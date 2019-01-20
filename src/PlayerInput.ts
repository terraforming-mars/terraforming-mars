
import { IProjectCard } from "./cards/IProjectCard";
import { Player } from "./Player";

/**
 * TODO still determining a better way to wait for input from a user
 * this interface is mostly tracking all places where we need input from a user
 * hopefully once all the cards are in place it becomes apparent a good method to 
 * use here.
 */
export interface PlayerInput {
    initiator: "card" | "board",
    card?: IProjectCard,
    type: "SelectAPlayerAndOption" | "SelectACard" | "AddResourceOrDrawCard" | "SelectAPlayer" | "SelectASpace" | "SelectAmount" | "Gain4PlantsOrAnotherCard" | "Gain5PlantsOrAdd4Animals" | "OptionOrCard",
    cardsToPick?: number,
    cards?: Array<IProjectCard>,
    players?: Array<Player>,
    message?: string,
    title?: string
    id?: string
    options?: Array<PlayerInput>
}
