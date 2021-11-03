import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class LakeMarineris extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LAKE_MARINERIS,
      cost: 18,
      tr: {oceans: 2},
      requirements: CardRequirements.builder((b) => b.temperature(0)),
      victoryPoints: 2,

      metadata: {
        cardNumber: '053',
        renderData: CardRenderer.builder((b) => b.oceans(2)),
        description: 'Requires 0° C or warmer. Place 2 ocean tiles.',
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player, 'Select space for first ocean'));
    player.game.defer(new PlaceOceanTile(player, 'Select space for second ocean'));
    return undefined;
  }
}
