
import {PlayerInputTypes} from '../PlayerInputTypes';
import {CardModel} from './CardModel';
import {ColonyModel} from './ColonyModel';
import {ColorWithNeutral} from '../Color';
import {IPayProductionModel} from './IPayProductionUnitsModel';
import {IAresData} from '../ares/IAresData';
import {Message} from '../Message';
import {PartyName} from '../turmoil/parties/PartyName';
import {TurmoilModel} from './TurmoilModel';

export interface PlayerInputModel {
    amount: number | undefined;
    availableSpaces: Array<string> | undefined;
    canUseHeat: boolean | undefined;
    canUseSteel: boolean | undefined;
    canUseTitanium: boolean | undefined;
    canUseSeeds: boolean | undefined;
    cards: Array<CardModel> | undefined;
    inputType: PlayerInputTypes;
    options: Array<PlayerInputModel> | undefined;
    min: number | undefined;
    max: number | undefined;
    maxByDefault?: boolean;
    maxCardsToSelect: number | undefined;
    microbes: number | undefined;
    floaters: number | undefined;
    science: number | undefined;
    seeds: number | undefined;
    minCardsToSelect: number | undefined;
    players: Array<ColorWithNeutral> | undefined;
    title: string | Message;
    buttonLabel: string;
    coloniesModel : Array<ColonyModel> | undefined;
    payProduction?: IPayProductionModel;
    aresData?: IAresData;
    selectBlueCardAction: boolean;
    showOnlyInLearnerMode?: boolean;
    showOwner?: boolean;
    availableParties: Array<PartyName> | undefined;
    turmoil?: TurmoilModel;
}
