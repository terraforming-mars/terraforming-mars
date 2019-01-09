
import { IProjectCard } from "./cards/IProjectCard";

export interface PlayerInput {
    initiator: "card",
    card?: IProjectCard,
    type: "SelectACardForFree" | "AddResourceOrDrawCard" | "SelectAPlayer" | "SelectASpace",
    cards?: Array<IProjectCard>
}
