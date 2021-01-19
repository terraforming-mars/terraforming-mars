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
    {cardName: CardName.AERIAL_LENSES, Factory: AerialLenses},
    {cardName: CardName.BANNED_DELEGATE, Factory: BannedDelegate},
    {cardName: CardName.CULTURAL_METROPOLIS, Factory: CulturalMetropolis},
    {cardName: CardName.DIASPORA_MOVEMENT, Factory: DiasporaMovement},
    {cardName: CardName.EVENT_ANALYSTS, Factory: EventAnalysts},
    {cardName: CardName.GMO_CONTRACT, Factory: GMOContract},
    {cardName: CardName.MARTIAN_MEDIA_CENTER, Factory: MartianMediaCenter},
    {cardName: CardName.PARLIAMENT_HALL, Factory: ParliamentHall},
    {cardName: CardName.PR_OFFICE, Factory: PROffice},
    {cardName: CardName.POLITICAL_ALLIANCE, Factory: PoliticalAlliance},
    {cardName: CardName.PUBLIC_CELEBRATIONS, Factory: PublicCelebrations},
    {cardName: CardName.RECRUITMENT, Factory: Recruitment},
    {cardName: CardName.RED_TOURISM_WAVE, Factory: RedTourismWave},
    {cardName: CardName.SPONSORED_MOHOLE, Factory: SponsoredMohole},
    {cardName: CardName.SUPPORTED_RESEARCH, Factory: SupportedResearch},
    {cardName: CardName.WILDLIFE_DOME, Factory: WildlifeDome},
    {cardName: CardName.VOTE_OF_NO_CONFIDENCE, Factory: VoteOfNoConfidence},
  ],

  corporationCards: [
    {cardName: CardName.LAKEFRONT_RESORTS, Factory: LakefrontResorts},
    {cardName: CardName.PRISTAR, Factory: Pristar},
    {cardName: CardName.TERRALABS_RESEARCH, Factory: TerralabsResearch},
    {cardName: CardName.UTOPIA_INVEST, Factory: UtopiaInvest},
    {cardName: CardName.SEPTUM_TRIBUS, Factory: SeptumTribus},
  ],
});

