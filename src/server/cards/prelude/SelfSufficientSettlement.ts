import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';

// TODO(kberg): Add a test
export class SelfSufficientSettlement extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.SELF_SUFFICIENT_SETTLEMENT,
      tags: [Tag.BUILDING, Tag.CITY],
      productionBox: {megacredits: 2},

      metadata: {
        cardNumber: 'P29',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).city();
        }),
        description: 'Increase your M€ production 2 steps. Place a City tile.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceCityTile(player));
    return undefined;
  }
}
