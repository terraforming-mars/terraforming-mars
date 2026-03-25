import {Card, StaticCardProperties} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {ICeoCard} from './ICeoCard';
import {IPlayer} from '../../IPlayer';
import {SerializedCard} from '../../SerializedCard';

type StaticCeoProperties = Pick<StaticCardProperties, 'name' | 'tags' | 'victoryPoints' | 'metadata'>;

export abstract class CeoCard extends Card implements ICeoCard {
  public isDisabled = false;
  public opgActionIsActive = false;

  constructor(properties: StaticCeoProperties) {
    super({
      type: CardType.CEO,
      ...properties,
    });
  }

  public canAct(_player: IPlayer): boolean {
    return this.isDisabled === false;
  }

  public override play(_player: IPlayer) {
    return undefined;
  }

  public override get type(): CardType.CEO {
    return CardType.CEO;
  }

  serialize(serialized: SerializedCard): void {
    serialized.isDisabled = this.isDisabled;
    if (this.opgActionIsActive !== undefined) {
      serialized.opgActionIsActive = this .opgActionIsActive;
    }
  }

  deserialize(serialized: SerializedCard): void {
    if (serialized.isDisabled) {
      this.isDisabled = serialized.isDisabled;
    }
    if (serialized.opgActionIsActive !== undefined) {
      this.opgActionIsActive = serialized.opgActionIsActive;
    }
  }
}
