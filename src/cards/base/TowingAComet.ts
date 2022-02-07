import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class TowingAComet extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.TOWING_A_COMET,
      tags: [Tags.SPACE],
      cost: 23,
      tr: {oxygen: 1, oceans: 1},

      metadata: {
        cardNumber: '075',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(1).oceans(1).br;
          b.plants(2);
        }),
        description: 'Gain 2 plants. Raise oxygen level 1 step and place an ocean tile.',
      },
    });
  }
  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    player.plants += 2;
    return player.game.increaseOxygenLevel(player, 1);
  }
}
