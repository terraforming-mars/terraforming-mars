import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AerialLenses} from './AerialLenses';
import {BannedDelegate} from './BannedDelegate';
import {CulturalMetropolis} from './CulturalMetropolis';
import {DiasporaMovement} from './DiasporaMovement';
import {EventAnalysts} from './EventAnalysts';
import {GMOContract} from './GMOContract';
import {LakefrontResorts} from './LakefrontResorts';
import {MartianMediaCenter} from './MartianMediaCenter';
import {ParliamentHall} from './ParliamentHall';
import {PoliticalAlliance} from './PoliticalAlliance';
import {Pristar} from './Pristar';
import {PROffice} from './PROffice';
import {PublicCelebrations} from './PublicCelebrations';
import {Recruitment} from './Recruitment';
import {RedTourismWave} from './RedTourismWave';
import {SeptumTribus} from './SeptumTribus';
import {SponsoredMohole} from './SponsoredMohole';
import {SupportedResearch} from './SupportedResearch';
import {TerralabsResearch} from './TerralabsResearch';
import {UtopiaInvest} from './UtopiaInvest';
import {VoteOfNoConfidence} from './VoteOfNoConfidence';
import {WildlifeDome} from './WildlifeDome';

export const TURMOIL_CARD_MANIFEST = new ModuleManifest({
  module: 'turmoil',
  projectCards: {
    [CardName.AERIAL_LENSES]: {Factory: AerialLenses},
    [CardName.BANNED_DELEGATE]: {Factory: BannedDelegate},
    [CardName.CULTURAL_METROPOLIS]: {Factory: CulturalMetropolis},
    [CardName.DIASPORA_MOVEMENT]: {Factory: DiasporaMovement},
    [CardName.EVENT_ANALYSTS]: {Factory: EventAnalysts},
    [CardName.GMO_CONTRACT]: {Factory: GMOContract},
    [CardName.MARTIAN_MEDIA_CENTER]: {Factory: MartianMediaCenter},
    [CardName.PARLIAMENT_HALL]: {Factory: ParliamentHall},
    [CardName.PR_OFFICE]: {Factory: PROffice},
    [CardName.POLITICAL_ALLIANCE]: {Factory: PoliticalAlliance},
    [CardName.PUBLIC_CELEBRATIONS]: {Factory: PublicCelebrations},
    [CardName.RECRUITMENT]: {Factory: Recruitment},
    [CardName.RED_TOURISM_WAVE]: {Factory: RedTourismWave},
    [CardName.SPONSORED_MOHOLE]: {Factory: SponsoredMohole},
    [CardName.SUPPORTED_RESEARCH]: {Factory: SupportedResearch},
    [CardName.WILDLIFE_DOME]: {Factory: WildlifeDome},
    [CardName.VOTE_OF_NO_CONFIDENCE]: {Factory: VoteOfNoConfidence},
  },

  corporationCards: {
    [CardName.LAKEFRONT_RESORTS]: {Factory: LakefrontResorts},
    [CardName.PRISTAR]: {Factory: Pristar},
    [CardName.TERRALABS_RESEARCH]: {Factory: TerralabsResearch},
    [CardName.UTOPIA_INVEST]: {Factory: UtopiaInvest},
    [CardName.SEPTUM_TRIBUS]: {Factory: SeptumTribus, compatibility: 'turmoil'},
  },
});

