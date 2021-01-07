import {LogMessageData} from './LogMessageData';
import {LogMessageDataType} from './LogMessageDataType';
import {LogMessageType} from './LogMessageType';
import {Player} from './Player';
import {CardName} from './CardName';
import {ICard} from './cards/ICard';
import {IAward} from './awards/IAward';
import {IMilestone} from './milestones/IMilestone';
import {Colony} from './colonies/Colony';
import {IParty} from './turmoil/parties/IParty';
import {LogMessage} from './LogMessage';
import {TileType} from './TileType';
import {SpaceBonus} from './SpaceBonus';

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

    public colony(value: Colony): LogBuilder {
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

    public tileType(value: TileType): LogBuilder {
      this.parameters.push(new LogMessageData(LogMessageDataType.TILE_TYPE, value.toString()));
      return this;
    }

    public spaceBonus(value: SpaceBonus): LogBuilder {
      this.parameters.push(new LogMessageData(LogMessageDataType.SPACE_BONUS, value.toString()));
      return this;
    }

    public logMessage(): LogMessage {
      return new LogMessage(this.type, this.message, this.parameters);
    }
}
