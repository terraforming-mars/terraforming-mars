import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {CrediCorMarsBot} from './base/CrediCorMarsBot';
import {EcoLineMarsBot} from './base/EcoLineMarsBot';
import {HelionMarsBot} from './base/HelionMarsBot';
import {InterplanetaryCinematicsMarsBot} from './base/InterplanetaryCinematicsMarsBot';
import {InventrixMarsBot} from './base/InventrixMarsBot';
import {MiningGuildMarsBot} from './base/MiningGuildMarsBot';
import {PhoboLogMarsBot} from './base/PhoboLogMarsBot';
import {SaturnSystemsMarsBot} from './base/SaturnSystemsMarsBot';
import {TeractorMarsBot} from './base/TeractorMarsBot';
import {TharsisRepublicMarsBot} from './base/TharsisRepublicMarsBot';
import {ThorgateMarsBot} from './base/ThorgateMarsBot';
import {UnitedNationsMarsInitiativeMarsBot} from './base/UnitedNationsMarsInitiativeMarsBot';

export const AUTOMA_BASE_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.CREDICOR]: new CrediCorMarsBot(),
    [CardName.ECOLINE]: new EcoLineMarsBot(),
    [CardName.HELION]: new HelionMarsBot(),
    [CardName.INTERPLANETARY_CINEMATICS]: new InterplanetaryCinematicsMarsBot(),
    [CardName.INVENTRIX]: new InventrixMarsBot(),
    [CardName.MINING_GUILD]: new MiningGuildMarsBot(),
    [CardName.PHOBOLOG]: new PhoboLogMarsBot(),
    [CardName.SATURN_SYSTEMS]: new SaturnSystemsMarsBot(),
    [CardName.TERACTOR]: new TeractorMarsBot(),
    [CardName.THARSIS_REPUBLIC]: new TharsisRepublicMarsBot(),
    [CardName.THORGATE]: new ThorgateMarsBot(),
    [CardName.UNITED_NATIONS_MARS_INITIATIVE]: new UnitedNationsMarsInitiativeMarsBot(),
  },
};
