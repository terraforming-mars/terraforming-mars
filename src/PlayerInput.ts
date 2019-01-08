
import { IProjectCard } from "./cards/IProjectCard";

export interface PlayerInput {
    initiator: "card",
    cardName: "InventionContest" | "OlympusConference",
    type: "SelectACardForFree" | "AddResourceOrDrawCard",
    cards?: Array<IProjectCard>
}
