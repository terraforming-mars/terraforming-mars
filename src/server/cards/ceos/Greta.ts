import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Resource} from '../../../common/Resource';
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
          b.tr(1).colon().megacredits(4).asterix();
          b.br;
        }),
        description: 'When you take an action or play a card that increases your TR THIS GENERATION (max 10 times), gain 4 M€.',
      },
    });
  }

  public opgActionIsActive = false;
  public effectTriggerCount = 0;

  public action(): PlayerInput | undefined {
    this.opgActionIsActive = true;
    this.isDisabled = true;
    return undefined;
  }

  public onIncreaseTerraformRating(player: Player, cardOwner: Player) {
    const game = player.game;
    if (this.opgActionIsActive === true && this.effectTriggerCount < 10) {
      if (player === cardOwner && game.phase === Phase.ACTION) {
        player.addResource(Resource.MEGACREDITS, 4, {log: true});
        this.effectTriggerCount++;
      }
    }
    return undefined;
  }
}
