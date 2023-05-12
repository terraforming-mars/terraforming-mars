import {GameModule} from '../../common/cards/GameModule';

export interface ICardFactory<T> {
  // Creates a new instance of this ard.
  Factory: new () => T;
  // Returns the required modules for this card.
  compatibility?: GameModule | Array<GameModule>;
  // False when the card should not be instantiated. It's reserved for fake and proxy cards.
  instantiate?: boolean;
}
