import { CardName } from "../../CardName";
import { GameModule } from "../../GameModule";
import { CardManifest } from "../CardManifest";
import { AgricolaInc } from "./AgricolaInc";
import { Incite } from "./Incite";
import { Playwrights } from "./Playwrights";
import { ProjectWorkshop } from "./ProjectWorkshop";

export const COMMUNITY_CARD_MANIFEST = new CardManifest({
    module: GameModule.Community,
    projectCards: [],
    corporationCards: [
        { cardName: CardName.AGRICOLA_INC, factory: AgricolaInc },
        { cardName: CardName.PROJECT_WORKSHOP, factory: ProjectWorkshop },
        { cardName: CardName.INCITE, factory: Incite },
        { cardName: CardName.PLAYWRIGHTS, factory: Playwrights }
    ]
})