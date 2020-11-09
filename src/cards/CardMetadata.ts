import { CardRequirements } from "./CardRequirements";
import { CardRenderer } from "../cards/render/CardRenderer";

export interface CardMetadata {
    cardNumber: string;
    description?: string;
    requirements?: CardRequirements;
    victoryPoints?: number; //TODO(chosta): class to handle points per tag and other special cases
    renderData?: CardRenderer;
}
