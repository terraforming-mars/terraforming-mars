import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {Card} from '../Card';

export class MooncrateBlockFactory extends Card {
  constructor() {
    super({
      name: CardName.MOONCRATE_BLOCK_FACTORY,
      cardType: CardType.ACTIVE,
      tags: [Tags.BUILDING],
      cost: 8,

      metadata: {
        description: 'Effect: When you pay for a luna standard project (colony, road, mine), you spend 4MC less. / Requires 1 mine on the Moon.',
        cardNumber: 'M38',
        renderData: CardRenderer.builder((_b) => {}),
      },
    });
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.tiles(player.game, TileType.MOON_MINE, true).length >= 1;
  }

  public play() {
    return undefined;
  }
}
