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

      tr: {tr: 5},

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
    // If this card is played during the action phase, the player may
    // have already gained TR this generation and that prevents the effect
    // from being applied this generation.
    player.preservationProgram = player.trThisGeneration === 0;
    // This is executed now because if it were in `behavior` it would be
    // rewarded before the effect was put in place.
    player.increaseTerraformRating(5);
    return undefined;
  }
}
