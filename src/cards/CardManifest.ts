import {CardName} from '../CardName';
import {Deck} from '../Deck';
import {GameModule} from '../GameModule';
import {CorporationCard} from './corporation/CorporationCard';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';

export class CardManifest {
    public module: GameModule;
    public projectCards : Deck<IProjectCard>;
    public projectCardsToRemove: Array<CardName>;
    public corporationCards : Deck<CorporationCard>;
    public preludeCards : Deck<IProjectCard>;
    constructor(arg: {
         module: GameModule,
         projectCards: Array<ICardFactory<IProjectCard>>,
         projectCardsToRemove?: Array<CardName>,
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
