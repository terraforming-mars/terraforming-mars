import {CardName} from '../../common/cards/CardName';
import {GameModule} from '../../common/cards/GameModule';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {ICorporationCard} from './corporation/ICorporationCard';
import {CardFactorySpec} from './CardFactorySpec';
import {IProjectCard} from './IProjectCard';
import {ICard} from './ICard';
import {IStandardProjectCard} from './IStandardProjectCard';
import {IStandardActionCard} from './IStandardActionCard';
import {IPreludeCard} from './prelude/IPreludeCard';
import {ICeoCard} from './ceos/ICeoCard';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';

export type CardManifest<T extends ICard> = Partial<Record<CardName, CardFactorySpec<T>>>;
export type GlobalEventManifest = Partial<Record<GlobalEventName, CardFactorySpec<IGlobalEvent>>>;

export const CardManifest = {
  keys<T extends ICard>(manifest: CardManifest<T>): Array<CardName> {
    return Object.keys(manifest) as Array<CardName>;
  },
  values<T extends ICard>(manifest: CardManifest<T>): Array<CardFactorySpec<T>> {
    return Object.values(manifest) as Array<CardFactorySpec<T>>;
  },
  entries<T extends ICard>(manifest: CardManifest<T>): Array<[CardName, CardFactorySpec<T>]> {
    return CardManifest.keys(manifest).map((key) => {
      const value = manifest[key];
      if (value === undefined) {
        throw new Error(`Manifest has key ${key} but no entry.`);
      }
      return [key, value];
    });
  },
} as const;

export const GlobalEventManifest = {
  keys(manifest: GlobalEventManifest): Array<GlobalEventName> {
    return Object.keys(manifest) as Array<GlobalEventName>;
  },
  values(manifest: GlobalEventManifest): Array<CardFactorySpec<IGlobalEvent>> {
    return Object.values(manifest) as Array<CardFactorySpec<IGlobalEvent>>;
  },
  entries(manifest: GlobalEventManifest): Array<[GlobalEventName, CardFactorySpec<IGlobalEvent>]> {
    return GlobalEventManifest.keys(manifest).map((key) => {
      const value = manifest[key];
      if (value === undefined) {
        throw new Error(`Manifest has key ${key} but no entry.`);
      }
      return [key, value];
    });
  },
} as const;

export class ModuleManifest {
  module: GameModule;
  projectCards : CardManifest<IProjectCard>;
  cardsToRemove: ReadonlySet<CardName>;
  corporationCards : CardManifest<ICorporationCard>;
  preludeCards : CardManifest<IPreludeCard>;
  ceoCards: CardManifest<ICeoCard>;
  standardProjects : CardManifest<IStandardProjectCard>;
  standardActions : CardManifest<IStandardActionCard>;
  globalEvents: GlobalEventManifest;
  constructor(arg: {
    module: GameModule,
    projectCards?: CardManifest<IProjectCard>,
    cardsToRemove?: Array<CardName>,
    corporationCards?: CardManifest<ICorporationCard>,
    ceoCards?: CardManifest<ICeoCard>,
    preludeCards?: CardManifest<IPreludeCard>,
    standardProjects?: CardManifest<IStandardProjectCard>,
    standardActions?: CardManifest<IStandardActionCard>,
    globalEvents?: GlobalEventManifest,
  }) {
    this.module = arg.module;
    this.projectCards = arg.projectCards || {};
    this.cardsToRemove = new Set(arg.cardsToRemove || []);
    this.corporationCards = arg.corporationCards || {};
    this.preludeCards = arg.preludeCards || {};
    this.ceoCards = arg.ceoCards || {};
    this.standardProjects = arg.standardProjects || {};
    this.standardActions = arg.standardActions || {};
    this.globalEvents = arg.globalEvents || {};
  }
}
