import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class MiningColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tag.SPACE],
      name: CardName.MINING_COLONY,
      cardType: CardType.AUTOMATED,
      productionBox: {titanium: 1},

      metadata: {
        cardNumber: 'C25',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).colonies(1);
        }),
        description: 'Increase your titanium production 1 step. Place a colony.',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.colonies.getPlayableColonies().length > 0;
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new BuildColony(player, {title: 'Select colony for Mining Colony'}));
    return undefined;
  }
}
