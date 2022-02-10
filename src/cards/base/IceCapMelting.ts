import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class IceCapMelting extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ICE_CAP_MELTING,
      cost: 5,
      tr: {oceans: 1},

      requirements: CardRequirements.builder((b) => b.temperature(2)),
      metadata: {
        cardNumber: '181',
        renderData: CardRenderer.builder((b) => b.oceans(1)),
        description: 'Requires +2 C or warmer. Place 1 ocean tile.',
      },
    });
  }
  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}
