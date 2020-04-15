
import { Color } from "../Color";
import { PartyName } from "../turmoil/parties/PartyName";

export interface TurmoilModel {
    dominant: PartyName | undefined;
    ruling: PartyName | undefined;
    chairman: Color | undefined;
    parties: Array<PartyModel> | undefined;
    lobby: Array<Color>;
    reserve: Array<DelegatesModel> | undefined;
}

export interface PartyModel {
    name: string;
    description: string;
    partyLeader: Color | undefined;
    delegates: Array<DelegatesModel>;
}

export interface DelegatesModel {
    color: Color;
    number: number;
}
