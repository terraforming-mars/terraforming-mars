import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {ICardRenderRoot} from '../../../common/cards/render/Types';
import {IGame} from '../../IGame';
import {IPlayer} from '../../IPlayer';

type StaticGlobalEventProperties = {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  renderData: ICardRenderRoot;
}

const staticGlobalEventProperties = new Map<GlobalEventName, StaticGlobalEventProperties>();

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
  public resolve(game: IGame) {
    return this.bespokeResolve(game);
  }

  public bespokeResolve(game: IGame) {
    for (const player of game.playersInGenerationOrder) {
      this.bespokeResolvePlayer(player);
    }
  }

  public bespokeResolvePlayer(_player: IPlayer) {
  }
}
