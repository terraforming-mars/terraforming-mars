import { CardName } from "../../CardName";
import { GameModule } from "../../GameModule";
import { CardManifest } from "../CardManifest";
import { AerialLenses } from "./AerialLenses";
import { BannedDelegate } from "./BannedDelegate";
import { CulturalMetropolis } from "./CulturalMetropolis";
import { DiasporaMovement } from "./DiasporaMovement";
import { EventAnalysts } from "./EventAnalysts";
import { GMOContract } from "./GMOContract";
import { LakefrontResorts } from "./LakefrontResorts";
import { MartianMediaCenter } from "./MartianMediaCenter";
import { ParliamentHall } from "./ParliamentHall";
import { PoliticalAlliance } from "./PoliticalAlliance";
import { Pristar } from "./Pristar";
import { PROffice } from "./PROffice";
import { PublicCelebrations } from "./PublicCelebrations";
import { Recruitment } from "./Recruitment";
import { RedTourismWave } from "./RedTourismWave";
import { SeptumTribus } from "./SeptumTribus";
import { SponsoredMohole } from "./SponsoredMohole";
import { SupportedResearch } from "./SupportedResearch";
import { TerralabsResearch } from "./TerralabsResearch";
import { UtopiaInvest } from "./UtopiaInvest";
import { VoteOfNoConfidence } from "./VoteOfNoConfidence";
import { WildlifeDome } from "./WildlifeDome";

export const TURMOIL_CARD_MANIFEST = new CardManifest({
    module: GameModule.Turmoil,
    projectCards: [
        { cardName: CardName.AERIAL_LENSES, factory: AerialLenses },
        { cardName: CardName.BANNED_DELEGATE, factory: BannedDelegate },
        { cardName: CardName.CULTURAL_METROPOLIS, factory: CulturalMetropolis },
        { cardName: CardName.DIASPORA_MOVEMENT, factory: DiasporaMovement },
        { cardName: CardName.EVENT_ANALYSTS, factory: EventAnalysts },
        { cardName: CardName.GMO_CONTRACT, factory: GMOContract },
        { cardName: CardName.MARTIAN_MEDIA_CENTER, factory: MartianMediaCenter },
        { cardName: CardName.PARLIAMENT_HALL, factory: ParliamentHall },
        { cardName: CardName.PR_OFFICE, factory: PROffice },
        { cardName: CardName.POLITICAL_ALLIANCE, factory: PoliticalAlliance },
        { cardName: CardName.PUBLIC_CELEBRATIONS, factory: PublicCelebrations },
        { cardName: CardName.RECRUITMENT, factory: Recruitment },
        { cardName: CardName.RED_TOURISM_WAVE, factory: RedTourismWave },
        { cardName: CardName.SPONSORED_MOHOLE, factory: SponsoredMohole },
        { cardName: CardName.SUPPORTED_RESEARCH, factory: SupportedResearch },
        { cardName: CardName.WILDLIFE_DOME, factory: WildlifeDome },
        { cardName: CardName.VOTE_OF_NO_CONFIDENCE, factory: VoteOfNoConfidence },
    ],

    corporationCards: [
        { cardName: CardName.LAKEFRONT_RESORTS, factory: LakefrontResorts },
        { cardName: CardName.PRISTAR, factory: Pristar },
        { cardName: CardName.TERRALABS_RESEARCH, factory: TerralabsResearch },
        { cardName: CardName.UTOPIA_INVEST, factory: UtopiaInvest },
        { cardName: CardName.SEPTUM_TRIBUS, factory: SeptumTribus }
    ]});
