import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {ShiftAresGlobalParametersDeferred} from '../../deferredActions/ShiftAresGlobalParametersDeferred';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';

export class ButterflyEffect extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BUTTERFLY_EFFECT,
      cost: 8,

      metadata: {
        cardNumber: 'A03',
        description: 'Gain 1 TR. Move each individual hazard marker up to 1 step up or down.',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.plate('All hazard markers').colon().text('-1 / 0 / +1', Size.SMALL);
        }),
      },
    });
  }
  public play(player: Player) {
    player.increaseTerraformRating();
    player.game.defer(new ShiftAresGlobalParametersDeferred(player));
    return undefined;
  }
}
