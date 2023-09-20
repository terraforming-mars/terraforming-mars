import {Card, StaticCardProperties} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {ICeoCard} from './ICeoCard';
import {IPlayer} from '../../IPlayer';

type StaticCeoProperties = Pick<StaticCardProperties, 'name' | 'tags' | 'victoryPoints' | 'metadata'>;

export abstract class CeoCard extends Card implements ICeoCard {
  public isDisabled = false;

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
}
