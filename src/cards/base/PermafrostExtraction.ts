import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';

export class PermafrostExtraction extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.PERMAFROST_EXTRACTION,
      cost: 8,
      tr: {oceans: 1},

      requirements: CardRequirements.builder((b) => b.temperature(-8)),
      metadata: {
        cardNumber: '191',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1);
        }),
        description: 'Requires -8 C or warmer. Place 1 ocean tile.',
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}
