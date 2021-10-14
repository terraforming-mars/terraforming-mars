import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class SubterraneanReservoir extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SUBTERRANEAN_RESERVOIR,
      cost: 11,
      tr: {oceans: 1},

      metadata: {
        cardNumber: '127',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1);
        }),
        description: 'Place 1 ocean tile.',
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}

