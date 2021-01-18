import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardName} from '../../CardName';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';

interface StaticPreludeProperties {
    metadata: CardMetadata;
    name: CardName;
    tags?: Array<Tags>;
}

export abstract class PreludeCard extends Card implements IProjectCard {
  constructor(properties: StaticPreludeProperties) {
    super({
      cardType: CardType.PRELUDE,
      name: properties.name,
      tags: properties.tags,
      metadata: properties.metadata,
    });
  }
  public abstract play(player: Player, game: Game): PlayerInput | undefined;
  public canPlay(_player: Player, _game: Game): boolean {
    return true;
  }
}
