import {Card, StaticCardProperties} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {ICeoCard} from './ICeoCard';
import {Player} from '../../../server/Player';

type StaticCeoProperties = Pick<StaticCardProperties, 'name' | 'tags' | 'victoryPoints' | 'metadata'>;

export abstract class CeoCard extends Card implements ICeoCard {
  public isDisabled = false;

  constructor(properties: StaticCeoProperties) {
    super({
      type: CardType.CEO,
      ...properties,
    });
  }

  public canAct(_player: Player): boolean {
    return this.isDisabled === false;
  }

  public override play(_player: Player) {
    return undefined;
  }

  public override get type(): CardType.CEO {
    return CardType.CEO;
  }
}
