
import { IProjectCard } from "./cards/IProjectCard";
import { Player } from "./Player";

export interface PlayerInput {
    initiator: "card" | "board",
    card?: IProjectCard,
    type: "SelectAPlayerAndOption" | "SelectACardForFree" | "AddResourceOrDrawCard" | "SelectAPlayer" | "SelectASpace" | "SelectAmount" | "Gain4PlantsOrAnotherCard" | "Gain5PlantsOrAdd4Animals" | "OptionOrCard",
    cardsToPick?: number,
    cards?: Array<IProjectCard>,
    players?: Array<Player>,
    message?: string
}
