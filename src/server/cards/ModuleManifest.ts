import {CardName} from '../../common/cards/CardName';
import {GameModule} from '../../common/cards/GameModule';
import {ICorporationCard} from './corporation/ICorporationCard';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';
import {ICard} from './ICard';
import {IStandardProjectCard} from './IStandardProjectCard';
import {IStandardActionCard} from './IStandardActionCard';
import {IPreludeCard} from './prelude/IPreludeCard';

export type CardManifest<T extends ICard> = Partial<Record<CardName, ICardFactory<T>>>;

export namespace CardManifest {
  export function keys<T extends ICard>(manifest: CardManifest<T>): Array<CardName> {
    return Object.keys(manifest) as Array<CardName>;
  }
  export function values<T extends ICard>(manifest: CardManifest<T>): Array<ICardFactory<T>> {
    return Object.values(manifest) as Array<ICardFactory<T>>;
  }
  export function entries<T extends ICard>(manifest: CardManifest<T>): Array<[CardName, ICardFactory<T>]> {
    return keys(manifest).map((key) => {
      const value = manifest[key];
      if (value === undefined) {
        throw new Error(`Manifest has key ${key} but no entry.`);
      }
      return [key, value];
    });
  }
}

export class ModuleManifest {
  module: GameModule;
  projectCards : CardManifest<IProjectCard>;
  cardsToRemove: Set<CardName>;
  corporationCards : CardManifest<ICorporationCard>;
  preludeCards : CardManifest<IPreludeCard>;
  standardProjects : CardManifest<IStandardProjectCard>;
  standardActions : CardManifest<IStandardActionCard>;
  constructor(arg: {
         module: GameModule,
         projectCards?: CardManifest<IProjectCard>,
         cardsToRemove?: Array<CardName>,
         corporationCards?: CardManifest<ICorporationCard>,
         preludeCards?: CardManifest<IPreludeCard>,
         standardProjects?: CardManifest<IStandardProjectCard>,
         standardActions?: CardManifest<IStandardActionCard>,
         }) {
    this.module = arg.module;
    this.projectCards = arg.projectCards || {};
    this.cardsToRemove = new Set(arg.cardsToRemove || []);
    this.corporationCards = arg.corporationCards || {};
    this.preludeCards = arg.preludeCards || {};
    this.standardProjects = arg.standardProjects || {};
    this.standardActions = arg.standardActions || {};
  }
}
