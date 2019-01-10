
import { IProjectCard } from "./cards/IProjectCard";
import { Player } from "./Player";

export interface PlayerInput {
    initiator: "card",
    card?: IProjectCard,
    type: "SelectACardForFree" | "AddResourceOrDrawCard" | "SelectAPlayer" | "SelectASpace" | "SelectAmount" | "Gain4PlantsOrAnotherCard",
    cards?: Array<IProjectCard>
    players?: Array<Player>
}
