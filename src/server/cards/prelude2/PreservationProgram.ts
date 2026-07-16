import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {cancelled, digit} from '../Options';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '../../IPlayer';

export class PreservationProgram extends PreludeCard {
  constructor() {
    super({
      name: CardName.PRESERVATION_PROGRAM,

      behavior: {
        tr: 5,
      },

      metadata: {
        cardNumber: 'P57',
        renderData: CardRenderer.builder((b) => {
          b.effect('SKIP THE FIRST TR YOU GAIN IN EACH GENERATION\'S ACTION PHASE.', (eb) => {
            eb.empty().startEffect.tr(1, {size: Size.SMALL, cancelled});
          }).br;
          b.tr(5, {digit});
        }),
        description: 'Raise your TR 5 steps.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.preservationProgram = true;
    return undefined;
  }
}
