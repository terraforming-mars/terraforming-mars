import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Resources} from '../../../common/Resources';
import {Phase} from '../../../common/Phase';

export class Greta extends CeoCard {
  constructor() {
    super({
      name: CardName.GRETA,
      metadata: {
        cardNumber: 'L31',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.tr(1).colon().megacredits(4);
          b.br;
        }),
        description: 'When you take an action or play a card that increases your TR THIS GENERATION, gain 4 M€ for each step.',
      },
    });
  }

  public opgActionIsActive = false;

  public action(): PlayerInput | undefined {
    this.opgActionIsActive = true;
    this.isDisabled = true;
    return undefined;
  }

  public onIncreaseTerraformRating(player: Player, cardOwner: Player, steps: number) {
    const game = player.game;
    if (this.opgActionIsActive === true) {
      if (player === cardOwner && game.phase === Phase.ACTION) {
        player.addResource(Resources.MEGACREDITS, 4*steps, {log: true});
      }
    }
    return undefined;
  }
}
