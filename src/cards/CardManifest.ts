import {CardName} from '../CardName';
import {Deck} from '../Deck';
import {GameModule} from '../GameModule';
import {CorporationCard} from './corporation/CorporationCard';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';
import {StandardAction} from './standardActions/StandardAction';
import {StandardProject} from './standardProjects/StandardProject';

export class CardManifest {
    module: GameModule;
    projectCards : Deck<IProjectCard>;
    cardsToRemove: Set<CardName>;
    corporationCards : Deck<CorporationCard>;
    preludeCards : Deck<IProjectCard>;
    standardActions : Deck<StandardAction>;
    constructor(arg: {
         module: GameModule,
         projectCards?: Array<ICardFactory<IProjectCard>>,
         cardsToRemove?: Array<CardName>,
         corporationCards?: Array<ICardFactory<CorporationCard>>,
         preludeCards?: Array<ICardFactory<IProjectCard>>,
         standardProjects?: Array<ICardFactory<StandardProject>>,
         standardActions?: Array<ICardFactory<StandardAction>>,
         }) {
      this.module = arg.module;
      this.projectCards = new Deck<IProjectCard>(arg.projectCards || []);
      this.cardsToRemove = new Set(arg.cardsToRemove || []);
      this.corporationCards = new Deck<CorporationCard>(arg.corporationCards || []);
      this.preludeCards = new Deck<IProjectCard>(arg.preludeCards || []);
      this.standardActions = new Deck<StandardAction>((arg.standardActions || []).concat(arg.standardProjects || []));
    }
}
