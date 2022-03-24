import {LogMessageData} from './common/logs/LogMessageData';
import {LogMessageDataType} from './common/logs/LogMessageDataType';
import {LogMessageType} from './common/logs/LogMessageType';
import {Player} from './Player';
import {CardName} from './common/cards/CardName';
import {ICard} from './cards/ICard';
import {IAward} from './awards/IAward';
import {IMilestone} from './milestones/IMilestone';
import {IParty} from './turmoil/parties/IParty';
import {LogMessage} from './common/logs/LogMessage';
import {TileType} from './common/TileType';
import {SpaceBonus} from './common/boards/SpaceBonus';
import {IGlobalEvent} from './turmoil/globalEvents/IGlobalEvent';
import {GlobalEventName} from './common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from './common/turmoil/PartyName';
import {IColony} from './colonies/IColony';

export class LogBuilder {
  private message: string;
  private parameters: Array<LogMessageData>;
  private type: LogMessageType;

  constructor(message: string) {
    this.message = message;
    this.parameters = [];
    this.type = LogMessageType.DEFAULT;
  }

  public forNewGeneration(): LogBuilder {
    this.type = LogMessageType.NEW_GENERATION;
    return this;
  }

  public string(value: string): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.STRING, value));
    return this;
  }

  public rawString(value: string): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.RAW_STRING, value));
    return this;
  }

  public number(value: number): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.RAW_STRING, value.toString()));
    return this;
  }

  public player(value: Player): LogBuilder {
    return this.playerId(value.color);
  }

  public playerId(value: string): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.PLAYER, value));
    return this;
  }

  public card(value: ICard): LogBuilder {
    return this.cardName(value.name);
  }

  public cardName(value: CardName): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.CARD, value));
    return this;
  }

  public award(value: IAward): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.AWARD, value.name));
    return this;
  }

  public milestone(value: IMilestone): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.MILESTONE, value.name));
    return this;
  }

  public colony(value: IColony): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.COLONY, value.name));
    return this;
  }

  public standardProject(value: string): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.STANDARD_PROJECT, value));
    return this;
  }

  public party(value: IParty): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.PARTY, value.name));
    return this;
  }

  public partyName(value: PartyName): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.PARTY, value));
    return this;
  }

  public tileType(value: TileType): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.TILE_TYPE, value.toString()));
    return this;
  }

  public spaceBonus(value: SpaceBonus): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.SPACE_BONUS, value.toString()));
    return this;
  }

  public globalEvent(value: IGlobalEvent): LogBuilder {
    return this.globalEventName(value.name);
  }

  public globalEventName(value: GlobalEventName): LogBuilder {
    this.parameters.push(new LogMessageData(LogMessageDataType.GLOBAL_EVENT, value.toString()));
    return this;
  }

  public build(): LogMessage {
    return new LogMessage(this.type, this.message, this.parameters);
  }
}
