import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {SophonSurveillanceNetwork} from './SophonSurveillanceNetwork';
import {EmmettVille} from './EmmettVille';
import {MatingSeason} from './MatingSeason';
import {Pandemic} from './Pandemic';
import {TheJetsons} from './TheJetsons';
import {CoppsColony} from './CoppsColony';
import {RainestownGreens} from './RainestownGreens';
import {StudwellingtonPlanitia} from './StudwellingtonPlanitia';

export const SHIL_CARD_MANIFEST = new ModuleManifest({
  module: 'shil',
  projectCards: {
    [CardName.SOPHON_SURVEILLANCE_NETWORK]: {Factory: SophonSurveillanceNetwork},
    [CardName.EMMETT_VILLE]: {Factory: EmmettVille},
    [CardName.MATING_SEASON]: {Factory: MatingSeason},
    [CardName.PANDEMIC]: {Factory: Pandemic},
    [CardName.THE_JETSONS]: {Factory: TheJetsons},
    [CardName.COPPS_COLONY]: {Factory: CoppsColony},
    [CardName.RAINESTOWN_GREENS]: {Factory: RainestownGreens},
    [CardName.STUDWELLINGTON_PLANITIA]: {Factory: StudwellingtonPlanitia},
  },
  corporationCards: {
    // Future corporations can be added here
  },
  preludeCards: {
    // Future preludes can be added here
  },
});

