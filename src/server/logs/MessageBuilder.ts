import {LogMessageDataType} from '../../common/logs/LogMessageDataType';
import {Player} from '../Player';
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

export class MessageBuilder {
  protected message: Message;

  constructor(message: string) {
    this.message = {
      data: [],
      message: message,
    };
  }

  public string(value: string): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.STRING, value});
    return this;
  }

  public rawString(value: string): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.RAW_STRING, value});
    return this;
  }

  public number(value: number): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.RAW_STRING, value: value.toString()});
    return this;
  }

  public player(value: Player): MessageBuilder {
    return this.playerId(value.color);
  }

  public playerId(value: string): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.PLAYER, value});
    return this;
  }

  public card(value: ICard): MessageBuilder {
    return this.cardName(value.name);
  }

  public cardName(value: CardName): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.CARD, value});
    return this;
  }

  public award(value: IAward): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.AWARD, value: value.name});
    return this;
  }

  public milestone(value: IMilestone): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.MILESTONE, value: value.name});
    return this;
  }

  public colony(value: IColony): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.COLONY, value: value.name});
    return this;
  }

  public standardProject(value: string): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.STANDARD_PROJECT, value});
    return this;
  }

  public party(value: IParty): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.PARTY, value: value.name});
    return this;
  }

  public partyName(value: PartyName): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.PARTY, value});
    return this;
  }

  public tileType(value: TileType): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.TILE_TYPE, value: value.toString()});
    return this;
  }

  public spaceBonus(value: SpaceBonus): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.SPACE_BONUS, value: value.toString()});
    return this;
  }

  public globalEvent(value: IGlobalEvent): MessageBuilder {
    return this.globalEventName(value.name);
  }

  public globalEventName(value: GlobalEventName): MessageBuilder {
    this.message.data.push({type: LogMessageDataType.GLOBAL_EVENT, value: value.toString()});
    return this;
  }

  public getMessage(): Message {
    return this.message;
  }
}

export function newMessage(message: string, f?: (builder: MessageBuilder) => void): Message {
  const builder = new MessageBuilder(message);
  f?.(builder);
  return builder.getMessage();
}
