import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {ShiftAresGlobalParametersDeferred} from '../../deferredActions/ShiftAresGlobalParametersDeferred';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {AresHandler} from '../../../server/ares/AresHandler';
import {HAZARD_CONSTRAINTS} from '../../../common/ares/AresData';

export class ButterflyEffect extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.BUTTERFLY_EFFECT,
      cost: 8,

      behavior: {
        tr: 1,
      },

      metadata: {
        cardNumber: 'A03',
        description: 'Gain 1 TR. Move each hazard marker up to 1 step up or down along its terraforming track.',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.plate('All hazard markers').colon().text('-1 / 0 / +1', Size.SMALL);
        }),
      },
    });
  }
  public override bespokePlay(player: IPlayer) {
    AresHandler.ifAres(player.game, (aresData) => {
      const hazardData = aresData.hazardData;
      if (HAZARD_CONSTRAINTS.some((constraint) => hazardData[constraint].available === true)) {
        player.game.defer(new ShiftAresGlobalParametersDeferred(player));
      } else {
        player.game.log('All global parameters are high enough that there is no point in changing any of them.');
      }
    });
    return undefined;
  }
}
