import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class IceAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ICE_ASTEROID,
      tags: [Tags.SPACE],
      cost: 23,
      tr: {oceans: 2},

      metadata: {
        cardNumber: '078',
        renderData: CardRenderer.builder((b) => b.oceans(2)),
        description: 'Place 2 ocean tiles.',
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player, 'Select space for first ocean'));
    player.game.defer(new PlaceOceanTile(player, 'Select space for second ocean'));
    return undefined;
  }
}
