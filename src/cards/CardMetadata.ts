import { CardRequirements } from "./CardRequirements";
import { CardRow } from "./CardRow";

export interface CardMetadata {
    cardNumber: string;
    description?: string;
    requirements?: CardRequirements;
    onPlay?: Array<CardRow>;
    victoryPoints?: number; //TODO(chosta): class to handle points per tag and other special cases
}
