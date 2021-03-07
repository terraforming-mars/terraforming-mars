import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Card} from '../Card';

export class ThoriumRush extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.THORIUM_RUSH,
      cardType: CardType.EVENT,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 39,

      metadata: {
        description: 'Place 1 colony tile, 1 mining tile and 1 road tile on the Moon. ' +
        'Raise Colony Rate, Mining Rate and Logistic Rate 1 step.',
        cardNumber: 'M56',
        renderData: CardRenderer.builder((b) => {
          b.moonColony().moonMine().moonRoad();
        }),
      },
    });
  };
  public canPlay(): boolean {
    return true;
  }

  public play(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    player.game.defer(new PlaceMoonMineTile(player));
    player.game.defer(new PlaceMoonRoadTile(player));
    return undefined;
  }
}
