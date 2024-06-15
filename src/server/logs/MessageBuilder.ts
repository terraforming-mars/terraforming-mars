import {LogMessageDataType} from '../../common/logs/LogMessageDataType';
import {IPlayer} from '../IPlayer';
import {CardName} from '../../common/cards/CardName';
import {ICard} from '../cards/ICard';
import {IAward} from '../awards/IAward';
import {IMilestone} from '../milestones/IMilestone';
import {IParty} from '../turmoil/parties/IParty';
import {TileType} from '../../common/TileType';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {IColony} from '../colonies/IColony';
import {Message} from '../../common/logs/Message';
import {Color} from '../../common/Color';
import {LogMessageData, LogMessageDataAttrs} from '../../common/logs/LogMessageData';

export class MessageBuilder {
  protected message: Message;

  constructor(message: string) {
    this.message = {
      data: [],
      message: message,
    };
  }

  public string(value: string): this {
    this.message.data.push({type: LogMessageDataType.STRING, value});
    return this;
  }

  public rawString(value: string): this {
    this.message.data.push({type: LogMessageDataType.RAW_STRING, value});
    return this;
  }

  public number(value: number): this {
    this.message.data.push({type: LogMessageDataType.RAW_STRING, value: value.toString()});
    return this;
  }

  public player(value: IPlayer): this {
    return this.playerColor(value.color);
  }

  public playerColor(value: Color): this {
    this.message.data.push({type: LogMessageDataType.PLAYER, value});
    return this;
  }

  public card(value: ICard, attrs?: LogMessageDataAttrs): this {
    return this.cardName(value.name, attrs);
  }

  public cardName(value: CardName, attrs?: LogMessageDataAttrs): this {
    const data: LogMessageData = {type: LogMessageDataType.CARD, value};
    if (attrs !== undefined) {
      data.attrs = attrs;
    }
    this.message.data.push(data);
    return this;
  }

  public award(value: IAward): this {
    this.message.data.push({type: LogMessageDataType.AWARD, value: value.name});
    return this;
  }

  public milestone(value: IMilestone): this {
    this.message.data.push({type: LogMessageDataType.MILESTONE, value: value.name});
    return this;
  }

  public colony(value: IColony): this {
    this.message.data.push({type: LogMessageDataType.COLONY, value: value.name});
    return this;
  }
  public party(value: IParty): this {
    return this.partyName(value.name);
  }

  public partyName(value: PartyName): this {
    this.message.data.push({type: LogMessageDataType.PARTY, value});
    return this;
  }

  public tileType(value: TileType): this {
    this.message.data.push({type: LogMessageDataType.TILE_TYPE, value: value});
    return this;
  }

  public spaceBonus(value: SpaceBonus): this {
    this.message.data.push({type: LogMessageDataType.SPACE_BONUS, value: value});
    return this;
  }

  public globalEvent(value: IGlobalEvent): this {
    return this.globalEventName(value.name);
  }

  public globalEventName(value: GlobalEventName): this {
    this.message.data.push({type: LogMessageDataType.GLOBAL_EVENT, value: value});
    return this;
  }

  public getMessage(): Message {
    return this.message;
  }
}

export function message(message: string, f?: (builder: MessageBuilder) => void): Message {
  const builder = new MessageBuilder(message);
  f?.(builder);
  return builder.getMessage();
}
