import { ICardFactory } from "../Dealer";
import { CorporationCard } from "./corporation/CorporationCard";
import { IProjectCard } from "./IProjectCard";

// A list of all cards by type
export abstract class CardManifest {
    projectCards : Array<ICardFactory<IProjectCard>> = [];
    projectCardsToRemove: Array<String> = [];
    corporations : Array<ICardFactory<CorporationCard>> = [];
    preludeCards : Array<ICardFactory<IProjectCard>> = [];

    findProjectCardByName(name: string): IProjectCard | undefined {
        let factory = this.projectCards?.find(((cf) => cf.cardName === name))?.factory;
        return factory ? new factory() : undefined;
    }

    findPreludeCardByName(name: string): IProjectCard | undefined {
        let factory = this.preludeCards?.find(((cf) => cf.cardName === name))?.factory;
        return factory ? new factory() : undefined;
    }

    findCorporationCardByName(name: string): CorporationCard | undefined {
        let factory = this.corporations?.find(((cf) => cf.cardName === name))?.factory;
        return factory ? new factory() : undefined;
    }
}
