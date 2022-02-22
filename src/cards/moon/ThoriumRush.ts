import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';

// TODO(kberg): Add a test for how this card operates with Reds. It will be a good verification.
export class ThoriumRush extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.THORIUM_RUSH,
      cardType: CardType.EVENT,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 39,
      tr: {moonColony: 1, moonMining: 1, moonLogistics: 1},

      metadata: {
        description: 'Place 1 colony tile, 1 mining tile and 1 road tile on the Moon. ' +
        'Raise the Colony Rate, Mining Rate and Logistic Rate 1 step.',
        cardNumber: 'M56',
        renderData: CardRenderer.builder((b) => {
          b.moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE})
            .moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE})
            .moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE});
        }),
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    player.game.defer(new PlaceMoonMineTile(player));
    player.game.defer(new PlaceMoonRoadTile(player));
    return undefined;
  }
}
