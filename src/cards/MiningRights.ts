import { CardName } from "../CardName";
import { MiningCard } from "./MiningCard";

export class MiningRights extends MiningCard {
    public cost: number = 9;
    public name = CardName.MINING_RIGHTS;
}
