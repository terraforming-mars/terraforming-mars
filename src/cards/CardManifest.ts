import {CardName} from '../CardName';
import {Deck} from '../Deck';
import {GameModule} from '../GameModule';
import {CorporationCard} from './corporation/CorporationCard';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';
import {StandardProjectCard} from './StandardProjectCard';
import {StandardActionCard} from './StandardActionCard';

export class CardManifest {
    module: GameModule;
    projectCards : Deck<IProjectCard>;
    cardsToRemove: Set<CardName>;
    corporationCards : Deck<CorporationCard>;
    preludeCards : Deck<IProjectCard>;
    standardProjects : Deck<StandardProjectCard>;
    standardActions : Deck<StandardActionCard>;
    constructor(arg: {
         module: GameModule,
         projectCards?: Array<ICardFactory<IProjectCard>>,
         cardsToRemove?: Array<CardName>,
         corporationCards?: Array<ICardFactory<CorporationCard>>,
         preludeCards?: Array<ICardFactory<IProjectCard>>,
         standardProjects?: Array<ICardFactory<StandardProjectCard>>,
         standardActions?: Array<ICardFactory<StandardActionCard>>,
         }) {
      this.module = arg.module;
      this.projectCards = new Deck<IProjectCard>(arg.projectCards || []);
      this.cardsToRemove = new Set(arg.cardsToRemove || []);
      this.corporationCards = new Deck<CorporationCard>(arg.corporationCards || []);
      this.preludeCards = new Deck<IProjectCard>(arg.preludeCards || []);
      this.standardProjects = new Deck<StandardProjectCard>(arg.standardProjects || []);
      this.standardActions = new Deck<StandardActionCard>(arg.standardActions || []);
    }
}
