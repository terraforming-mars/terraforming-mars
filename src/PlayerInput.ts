
import { IProjectCard } from "./cards/IProjectCard";
import { Player } from "./Player";

export interface PlayerInput {
    initiator: "card" | "board",
    card?: IProjectCard,
    type: "SelectACardForFree" | "AddResourceOrDrawCard" | "SelectAPlayer" | "SelectASpace" | "SelectAmount" | "Gain4PlantsOrAnotherCard" | "Gain5PlantsOrAdd4Animals",
    cards?: Array<IProjectCard>,
    players?: Array<Player>,
    message?: string
}
