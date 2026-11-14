import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {CREDICOR_MARSBOT_CORP} from './base/CrediCorMarsBot';
import {ECOLINE_MARSBOT_CORP} from './base/EcoLineMarsBot';
import {HELION_MARSBOT_CORP} from './base/HelionMarsBot';
import {INTERPLANETARY_CINEMATICS_MARSBOT_CORP} from './base/InterplanetaryCinematicsMarsBot';
import {INVENTRIX_MARSBOT_CORP} from './base/InventrixMarsBot';
import {MINING_GUILD_MARSBOT_CORP} from './base/MiningGuildMarsBot';
import {PHOBOLOG_MARSBOT_CORP} from './base/PhoboLogMarsBot';
import {SATURN_SYSTEMS_MARSBOT_CORP} from './base/SaturnSystemsMarsBot';
import {TERACTOR_MARSBOT_CORP} from './base/TeractorMarsBot';
import {THARSIS_REPUBLIC_MARSBOT_CORP} from './base/TharsisRepublicMarsBot';
import {THORGATE_MARSBOT_CORP} from './base/ThorgateMarsBot';
import {UNITED_NATIONS_MARS_INITIATIVE_MARSBOT_CORP} from './base/UnitedNationsMarsInitiativeMarsBot';

export const AUTOMA_BASE_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.CREDICOR]: CREDICOR_MARSBOT_CORP,
    [CardName.ECOLINE]: ECOLINE_MARSBOT_CORP,
    [CardName.HELION]: HELION_MARSBOT_CORP,
    [CardName.INTERPLANETARY_CINEMATICS]: INTERPLANETARY_CINEMATICS_MARSBOT_CORP,
    [CardName.INVENTRIX]: INVENTRIX_MARSBOT_CORP,
    [CardName.MINING_GUILD]: MINING_GUILD_MARSBOT_CORP,
    [CardName.PHOBOLOG]: PHOBOLOG_MARSBOT_CORP,
    [CardName.SATURN_SYSTEMS]: SATURN_SYSTEMS_MARSBOT_CORP,
    [CardName.TERACTOR]: TERACTOR_MARSBOT_CORP,
    [CardName.THARSIS_REPUBLIC]: THARSIS_REPUBLIC_MARSBOT_CORP,
    [CardName.THORGATE]: THORGATE_MARSBOT_CORP,
    [CardName.UNITED_NATIONS_MARS_INITIATIVE]: UNITED_NATIONS_MARS_INITIATIVE_MARSBOT_CORP,
  },
};
