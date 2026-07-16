import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardMetadata} from '../../common/cards/CardMetadata';
import {Tag} from '../../common/cards/Tag';
import {IProjectCard} from './IProjectCard';
import {IPlayer} from '../IPlayer';
import {GlobalParameter} from '../../common/GlobalParameter';
import {Warning} from '../../common/cards/Warning';

const EMPTY_SET: Readonly<Set<Warning>> = new Set();

export class ProxyCard implements IProjectCard {
  public readonly name: CardName;
  public constructor(name: CardName) {
    this.name = name;
  }
  public get cost() {
    return 0;
  }
  public get tags(): Array<Tag> {
    return [];
  }
  public get type() {
    return CardType.PROXY;
  }
  public canPlay() {
    return false;
  }
  public canPlayPostRequirements(): boolean {
    return false;
  }
  public get metadata(): CardMetadata {
    throw new Error(this.name + ' is a proxy card, not a real card. Should not render');
  }
  public play() {
    return undefined;
  }
  public get resourceCount() {
    return 0;
  }
  public getVictoryPoints() {
    return 0;
  }
  public get requirements() {
    return [];
  }
  public getGlobalParameterRequirementBonus(_player: IPlayer, _parameter: GlobalParameter): number {
    return 0;
  }
  public get tilesBuilt() {
    return [];
  }
  public get warnings() {
    return EMPTY_SET;
  }
}
