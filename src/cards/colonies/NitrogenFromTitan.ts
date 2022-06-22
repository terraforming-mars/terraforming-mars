import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardResource} from '../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class NitrogenFromTitan extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 25,
      tags: [Tags.JOVIAN, Tags.SPACE],
      name: CardName.NITROGEN_FROM_TITAN,
      cardType: CardType.AUTOMATED,
      tr: {tr: 2},
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C28',
        renderData: CardRenderer.builder((b) => {
          b.tr(2).floaters(2, {secondaryTag: Tags.JOVIAN});
        }),
        description: 'Raise your TR 2 steps. Add 2 floaters to a JOVIAN CARD.',
      },
    });
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2, restrictedTag: Tags.JOVIAN}));
    return undefined;
  }
}

