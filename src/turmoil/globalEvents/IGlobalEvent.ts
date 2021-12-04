import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

export interface IGlobalEvent {
    name: GlobalEventName,
    description: string,
    revealedDelegate: PartyName,
    currentDelegate: PartyName,
    renderData: CardRenderer;
    resolve: (game: Game, turmoil: Turmoil) => void;
}

export interface StaticGlobalEventProperties {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  renderData: CardRenderer;
}

export const staticGlobalEventProperties = new Map<GlobalEventName, StaticGlobalEventProperties>();

export abstract class GlobalEvent {
  private readonly properties: StaticGlobalEventProperties;
  constructor(properties: StaticGlobalEventProperties) {
    let staticInstance = staticGlobalEventProperties.get(properties.name);
    if (staticInstance === undefined) {
      staticGlobalEventProperties.set(properties.name, properties);
      staticInstance = properties;
    }
    this.properties = staticInstance;
  }
  public get name() {
    return this.properties.name;
  }
  public get description() {
    return this.properties.description;
  }
  public get revealedDelegate() {
    return this.properties.revealedDelegate;
  }
  public get currentDelegate() {
    return this.properties.currentDelegate;
  }
  public get renderData() {
    return this.properties.renderData;
  }
}
