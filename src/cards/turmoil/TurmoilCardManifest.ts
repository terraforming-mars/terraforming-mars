import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
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

export const TURMOIL_CARD_MANIFEST = new CardManifest({
  module: GameModule.Turmoil,
  projectCards: [
    CardManifest.dynamicFactory(CardName.AERIAL_LENSES, AerialLenses),
    CardManifest.staticFactory(CardName.BANNED_DELEGATE, new BannedDelegate()),
    CardManifest.dynamicFactory(CardName.CULTURAL_METROPOLIS, CulturalMetropolis),
    CardManifest.dynamicFactory(CardName.DIASPORA_MOVEMENT, DiasporaMovement),
    CardManifest.dynamicFactory(CardName.EVENT_ANALYSTS, EventAnalysts),
    CardManifest.dynamicFactory(CardName.GMO_CONTRACT, GMOContract),
    CardManifest.dynamicFactory(CardName.MARTIAN_MEDIA_CENTER, MartianMediaCenter),
    CardManifest.dynamicFactory(CardName.PARLIAMENT_HALL, ParliamentHall),
    CardManifest.dynamicFactory(CardName.PR_OFFICE, PROffice),
    CardManifest.staticFactory(CardName.POLITICAL_ALLIANCE, new PoliticalAlliance()),
    CardManifest.staticFactory(CardName.PUBLIC_CELEBRATIONS, new PublicCelebrations()),
    CardManifest.staticFactory(CardName.RECRUITMENT, new Recruitment()),
    CardManifest.staticFactory(CardName.RED_TOURISM_WAVE, new RedTourismWave()),
    CardManifest.dynamicFactory(CardName.SPONSORED_MOHOLE, SponsoredMohole),
    CardManifest.dynamicFactory(CardName.SUPPORTED_RESEARCH, SupportedResearch),
    CardManifest.dynamicFactory(CardName.WILDLIFE_DOME, WildlifeDome),
    CardManifest.staticFactory(CardName.VOTE_OF_NO_CONFIDENCE, new VoteOfNoConfidence()),
  ],

  corporationCards: [
    CardManifest.dynamicFactory(CardName.LAKEFRONT_RESORTS, LakefrontResorts),
    CardManifest.dynamicFactory(CardName.PRISTAR, Pristar),
    CardManifest.dynamicFactory(CardName.TERRALABS_RESEARCH, TerralabsResearch),
    CardManifest.dynamicFactory(CardName.UTOPIA_INVEST, UtopiaInvest),
    CardManifest.dynamicFactory(CardName.SEPTUM_TRIBUS, SeptumTribus),
  ]});
