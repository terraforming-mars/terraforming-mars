import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Resource} from '../../../common/Resource';
import {multiplier} from '../Options';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';


export class Duncan extends CeoCard {
  constructor() {
    super({
      name: CardName.DUNCAN,

      victoryPoints: 'special',

      metadata: {
        cardNumber: 'L04',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().vpIcon().asterix().megacredits(4, {multiplier});
          b.br;
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(),
        description: 'Once per game, gain 7-X VP and 4X M€, where X is the current generation number.',
      },
    });
  }

  public generationUsed = -1;

  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    player.addResource(Resource.MEGACREDITS, 4 * player.game.generation, {log: true});
    this.generationUsed = player.game.generation;
    return undefined;
  }

  public override getVictoryPoints(): number {
    if (this.isDisabled === true && this.generationUsed !== undefined) {
      return 7 - this.generationUsed;
    }
    return 0;
  }
}
