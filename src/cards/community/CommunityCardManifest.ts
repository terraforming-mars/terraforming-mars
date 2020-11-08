import { CardName } from "../../CardName";
import { GameModule } from "../../GameModule";
import { CardManifest } from "../CardManifest";
import { AgricolaInc } from "./AgricolaInc";
import { Incite } from "./Incite";
import { Playwrights } from "./Playwrights";
import { ProjectWorkshop } from "./ProjectWorkshop";
import { ResearchGrant } from "./ResearchGrant";
import { ValuableGases } from "./ValuableGases";
import { VenusFirst } from "./VenusFirst";
import { AerospaceMission } from "./AerospaceMission";
import { TradeAdvance } from "./TradeAdvance";
import { PoliticalUprising } from "./PoliticalUprising";
import { ByElection } from "./ByElection";
import { Midas } from "./Midas";

export const COMMUNITY_CARD_MANIFEST = new CardManifest({
    module: GameModule.Community,
    projectCards: [],
    corporationCards: [
        { cardName: CardName.AGRICOLA_INC, factory: AgricolaInc },
        { cardName: CardName.PROJECT_WORKSHOP, factory: ProjectWorkshop },
        { cardName: CardName.INCITE, factory: Incite },
        { cardName: CardName.PLAYWRIGHTS, factory: Playwrights },
        { cardName: CardName.MIDAS, factory: Midas },
    ],
    preludeCards: [
        { cardName: CardName.RESEARCH_GRANT, factory: ResearchGrant },
        {
            cardName: CardName.VALUABLE_GASES,
            factory: ValuableGases,
            compatibility: GameModule.Venus,
        },
        {
            cardName: CardName.VENUS_FIRST,
            factory: VenusFirst,
            compatibility: GameModule.Venus,
        },
        {
            cardName: CardName.AEROSPACE_MISSION,
            factory: AerospaceMission,
            compatibility: GameModule.Colonies,
        },
        {
            cardName: CardName.TRADE_ADVANCE,
            factory: TradeAdvance,
            compatibility: GameModule.Colonies,
        },
        {
            cardName: CardName.POLITICAL_UPRISING,
            factory: PoliticalUprising,
            compatibility: GameModule.Turmoil,
        },
        {
            cardName: CardName.BY_ELECTION,
            factory: ByElection,
            compatibility: GameModule.Turmoil,
        },
    ],
});
