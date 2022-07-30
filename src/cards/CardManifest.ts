import {CardName} from '../common/cards/CardName';
import {Deck} from '../Deck';
import {GameModule} from '../common/cards/GameModule';
import {ICorporationCard} from './corporation/ICorporationCard';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';
import {StandardProjectCard} from './StandardProjectCard';
import {StandardActionCard} from './StandardActionCard';
import {PreludeCard} from './prelude/PreludeCard';

export class CardManifest {
  module: GameModule;
  projectCards : Deck<IProjectCard>;
  cardsToRemove: Set<CardName>;
  corporationCards : Deck<ICorporationCard>;
  preludeCards : Deck<PreludeCard>;
  standardProjects : Deck<StandardProjectCard>;
  standardActions : Deck<StandardActionCard>;
  constructor(arg: {
         module: GameModule,
         projectCards?: Array<ICardFactory<IProjectCard>>,
         cardsToRemove?: Array<CardName>,
         corporationCards?: Array<ICardFactory<ICorporationCard>>,
         preludeCards?: Array<ICardFactory<PreludeCard>>,
         standardProjects?: Array<ICardFactory<StandardProjectCard>>,
         standardActions?: Array<ICardFactory<StandardActionCard>>,
         }) {
    this.module = arg.module;
    this.projectCards = new Deck<IProjectCard>(arg.projectCards || []);
    this.cardsToRemove = new Set(arg.cardsToRemove || []);
    this.corporationCards = new Deck<ICorporationCard>(arg.corporationCards || []);
    this.preludeCards = new Deck<PreludeCard>(arg.preludeCards || []);
    this.standardProjects = new Deck<StandardProjectCard>(arg.standardProjects || []);
    this.standardActions = new Deck<StandardActionCard>(arg.standardActions || []);
  }
}
