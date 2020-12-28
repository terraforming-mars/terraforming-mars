import {CardName} from '../CardName';
import {Deck} from '../Deck';
import {GameModule} from '../GameModule';
import {CorporationCard} from './corporation/CorporationCard';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';
import {StandardProjectCard} from './standardProjects/StandardProjectCard';

export class CardManifest {
    module: GameModule;
    projectCards : Deck<IProjectCard>;
    projectCardsToRemove: Array<String>;
    corporationCards : Deck<CorporationCard>;
    preludeCards : Deck<IProjectCard>;
    standardProjects : Deck<StandardProjectCard>;
    constructor(arg: {
         module: GameModule,
         projectCards?: Array<ICardFactory<IProjectCard>>,
         projectCardsToRemove?: Array<String>,
         corporationCards?: Array<ICardFactory<CorporationCard>>,
         preludeCards?: Array<ICardFactory<IProjectCard>>,
         standardProjects?: Array<ICardFactory<StandardProjectCard>>,
         }) {
      this.module = arg.module;
      this.projectCards = new Deck<IProjectCard>(arg.projectCards || []);
      this.projectCardsToRemove = arg.projectCardsToRemove || [];
      this.corporationCards = new Deck<CorporationCard>(arg.corporationCards || []);
      this.preludeCards = new Deck<IProjectCard>(arg.preludeCards || []);
      this.standardProjects = new Deck<StandardProjectCard>(arg.standardProjects || []);
    }

    /**
     * Creates a card factory for use with cards that need separate instances.
     * Cards that track state need to be dynamic as the state can change per instance of the card.
     * @param {CardName} cardName the name of the card
     * @param {Class<T>} Card constructor which creates a new card from factory
     * @param {GameModule} compatibility which game module card works with
     * @return {ICardFactory<T>} card factory which supplies new instance of card from factory
     */
    public static dynamicFactory<T>(cardName: CardName, Card: new () => T, compatibility?: GameModule): ICardFactory<T> {
      return {
        cardName,
        compatibility,
        factory: () => new Card(),
      };
    }
    /**
     * Creates a card factory for use with cards that can use one instance. Cards without state like event cards
     * can be static as they have no state to track per instance of card.
     * @param {CardName} cardName the name of the card
     * @param {T} card the card to return from factory
     * @param {GameModule} compatibility which game module card works with
     * @return {ICardFactory<T>} card factory which supplies instance of card from factory
     */
    public static staticFactory<T>(cardName: CardName, card: T, compatibility?: GameModule): ICardFactory<T> {
      return {
        cardName,
        compatibility,
        factory: () => card,
      };
    }
}
