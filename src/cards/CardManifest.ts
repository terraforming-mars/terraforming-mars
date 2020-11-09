import {Deck} from '../Deck';
import {GameModule} from '../GameModule';
import {CorporationCard} from './corporation/CorporationCard';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';

export class CardManifest {
    module: GameModule;
    projectCards : Deck<IProjectCard>;
    projectCardsToRemove: Array<String>;
    corporationCards : Deck<CorporationCard>;
    preludeCards : Deck<IProjectCard>;
    constructor(arg: {
         module: GameModule,
         projectCards?: Array<ICardFactory<IProjectCard>>,
         projectCardsToRemove?: Array<String>,
         corporationCards?: Array<ICardFactory<CorporationCard>>,
         preludeCards?: Array<ICardFactory<IProjectCard>>,
         }) {
      this.module = arg.module;
      this.projectCards = new Deck<IProjectCard>(arg.projectCards || []);
      this.projectCardsToRemove = arg.projectCardsToRemove || [];
      this.corporationCards = new Deck<CorporationCard>(arg.corporationCards || []);
      this.preludeCards = new Deck<IProjectCard>(arg.preludeCards || []);
    }
}
