import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {ICardRenderRoot} from '../../../common/cards/render/Types';
import {IGame} from '../../IGame';
import {IPlayer} from '../../IPlayer';
import {Behavior} from '../../behavior/Behavior';
import {getBehaviorExecutor} from '../../behavior/BehaviorExecutor';

type GlobalEventBehavior = Behavior & {
  once?: Behavior;
};

type StaticGlobalEventProperties = {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  behavior?: GlobalEventBehavior,
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
  public get behavior() {
    return this.properties.behavior;
  }
  public get renderData() {
    return this.properties.renderData;
  }
  public resolve(game: IGame): void {
    const behavior = this.behavior;
    const executor = getBehaviorExecutor();
    if (behavior?.once) {
      executor.execute(behavior.once, game.playersInGenerationOrder[0], this);
    }
    this.bespokeResolve(game);
    for (const player of game.playersInGenerationOrder) {
      if (behavior !== undefined) {
        executor.execute(behavior, player, this);
      }
      this.bespokeResolvePlayer(player);
    }
  }

  public bespokeResolve(_game: IGame): void {
  }

  public bespokeResolvePlayer(_player: IPlayer): void {
  }
}
