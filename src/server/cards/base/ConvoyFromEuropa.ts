import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class ConvoyFromEuropa extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CONVOY_FROM_EUROPA,
      tags: [Tag.SPACE],
      cost: 15,
      tr: {oceans: 1},

      behavior: {
        drawCard: 1,
      },

      metadata: {
        cardNumber: '161',
        description: 'Place 1 ocean tile and draw 1 card.',
        renderData: CardRenderer.builder((b) => b.oceans(1).cards(1)),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}
