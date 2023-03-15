import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {ICeoCard} from './ICeoCard';
import {Player} from '../../../server/Player';

interface StaticCeoProperties {
    metadata: ICardMetadata;
    name: CardName;
    tags?: Array<Tag>;
}

export abstract class CeoCard extends Card implements ICeoCard {
  public isDisabled = false;

  constructor(properties: StaticCeoProperties) {
    super({
      type: CardType.CEO,
      name: properties.name,
      tags: properties.tags,
      metadata: properties.metadata,
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
