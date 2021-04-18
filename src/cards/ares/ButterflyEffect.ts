import {Card} from '../Card';
import {CardName} from '../../CardName';
import {ShiftAresGlobalParametersDeferred} from '../../deferredActions/ShiftAresGlobalParametersDeferred';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class ButterflyEffect extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BUTTERFLY_EFFECT,
      cost: 8,

      metadata: {
        cardNumber: 'A03',
        description: 'Effect: Gain 1 TR. Move each individual hazard marker up to 1 step up or down.',
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
