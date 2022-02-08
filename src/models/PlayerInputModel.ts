
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {CardModel} from './CardModel';
import {ColonyModel} from '../common/models/ColonyModel';
import {ColorWithNeutral} from '../common/Color';
import {IPayProductionModel} from '../common/models/IPayProductionUnitsModel';
import {IAresData} from '../common/ares/IAresData';
import {Message} from '../common/logs/Message';
import {PartyName} from '../common/turmoil/PartyName';
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
