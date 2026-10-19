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
import {UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';
import {Space} from '../boards/Space';
import {SpaceId} from '../../common/Types';
import {toName} from '../../common/utils/utils';
import {Resource} from '@/common/Resource';
import {CardResource} from '@/common/CardResource';

export class MessageBuilder {
  protected message: Message;

  constructor(message: string) {
    this.message = {
      data: [],
      message: message,
    };
  }

  private push(datum: LogMessageData) {
    this.message.data.push(datum);
  }

  public string(value: string): this {
    this.push({type: LogMessageDataType.STRING, value});
    return this;
  }

  public rawString(value: string): this {
    this.push({type: LogMessageDataType.RAW_STRING, value});
    return this;
  }

  public number(value: number): this {
    this.push({type: LogMessageDataType.RAW_STRING, value: value.toString()});
    return this;
  }

  public player(value: IPlayer): this {
    return this.playerColor(value.color);
  }

  public playerColor(value: Color): this {
    this.push({type: LogMessageDataType.PLAYER, value});
    return this;
  }

  public card(value: ICard, attrs?: LogMessageDataAttrs): this {
    return this.cardName(value.name, attrs);
  }

  public cards(value: ReadonlyArray<ICard>, attrs?: LogMessageDataAttrs): this {
    return this.cardNames(value.map(toName), attrs);
  }

  public cardNames(value: ReadonlyArray<CardName>, attrs?: LogMessageDataAttrs): this {
    const data: LogMessageData = {type: LogMessageDataType.CARDS, value};
    if (attrs !== undefined) {
      data.attrs = attrs;
    }
    this.push(data);
    return this;
  }

  public cardName(value: CardName, attrs?: LogMessageDataAttrs): this {
    const data: LogMessageData = {type: LogMessageDataType.CARD, value};
    if (attrs !== undefined) {
      data.attrs = attrs;
    }
    this.push(data);
    return this;
  }

  public award(value: IAward): this {
    this.push({type: LogMessageDataType.AWARD, value: value.name});
    return this;
  }

  public milestone(value: IMilestone): this {
    this.push({type: LogMessageDataType.MILESTONE, value: value.name});
    return this;
  }

  public colony(value: IColony): this {
    this.push({type: LogMessageDataType.COLONY, value: value.name});
    return this;
  }
  public party(value: IParty): this {
    return this.partyName(value.name);
  }

  public partyName(value: PartyName): this {
    this.push({type: LogMessageDataType.PARTY, value});
    return this;
  }

  public tileType(value: TileType): this {
    this.push({type: LogMessageDataType.TILE_TYPE, value: value});
    return this;
  }

  public spaceBonus(value: SpaceBonus): this {
    this.push({type: LogMessageDataType.SPACE_BONUS, value: value});
    return this;
  }

  public globalEvent(value: IGlobalEvent): this {
    return this.globalEventName(value.name);
  }

  public globalEventName(value: GlobalEventName): this {
    this.push({type: LogMessageDataType.GLOBAL_EVENT, value: value});
    return this;
  }

  public undergroundToken(value: UndergroundResourceToken): this {
    this.push({type: LogMessageDataType.UNDERGROUND_TOKEN, value: value});
    return this;
  }

  public space(value: Space): this {
    this.push({type: LogMessageDataType.SPACE, value: value.id});
    return this;
  }

  public spaceId(value: SpaceId): this {
    this.push({type: LogMessageDataType.SPACE, value: value});
    return this;
  }

  public resource(value: Resource): this {
    this.push({type: LogMessageDataType.RESOURCE, value: value});
    return this;
  }

  public production(value: Resource): this {
    this.push({type: LogMessageDataType.PRODUCTION, value: value});
    return this;
  }

  public cardResource(value: CardResource | undefined): this {
    if (value !== undefined) {
      this.push({type: LogMessageDataType.CARD_RESOURCE, value: value});
    } else {
      this.push({type: LogMessageDataType.STRING, value: 'resource'});
    }
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
