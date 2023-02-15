import {PlayerInputType} from '../input/PlayerInputType';
import {CardModel} from './CardModel';
import {ColonyModel} from './ColonyModel';
import {ColorWithNeutral} from '../Color';
import {PayProductionModel} from './PayProductionUnitsModel';
import {AresData} from '../ares/AresData';
import {Message} from '../logs/Message';
import {PartyName} from '../turmoil/PartyName';
import {TurmoilModel} from './TurmoilModel';
import {SpaceId} from '../Types';

export interface PlayerInputModel {
    amount: number | undefined;
    availableSpaces: Array<SpaceId> | undefined;
    canUseHeat: boolean | undefined;
    canUseSteel: boolean | undefined;
    canUseTitanium: boolean | undefined;
    canUseSeeds: boolean | undefined;
    canUseData: boolean | undefined;
    canUseLunaTradeFederationTitanium: boolean | undefined;
    cards: Array<CardModel> | undefined;
    inputType: PlayerInputType;
    options: Array<PlayerInputModel> | undefined;
    min: number | undefined;
    max: number | undefined;
    maxByDefault?: boolean;
    microbes: number | undefined;
    floaters: number | undefined;
    science: number | undefined;
    seeds: number | undefined;
    data: number | undefined;
    players: Array<ColorWithNeutral> | undefined;
    title: string | Message;
    buttonLabel: string;
    coloniesModel : Array<ColonyModel> | undefined;
    payProduction?: PayProductionModel;
    aresData?: AresData;
    selectBlueCardAction: boolean;
    showOnlyInLearnerMode?: boolean;
    showOwner?: boolean;
    availableParties: Array<PartyName> | undefined;
    turmoil?: TurmoilModel;
    showReset: boolean;
}
