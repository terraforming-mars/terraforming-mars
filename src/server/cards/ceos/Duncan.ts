import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Resource} from '../../../common/Resource';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';


export class Duncan extends CeoCard {
  constructor() {
    super({
      name: CardName.DUNCAN,

      victoryPoints: 'special',

      metadata: {
        cardNumber: 'L04',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().vpIcon().asterix().megacredits(1, {text: '4x'});
          b.br;
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(),
        description: 'Once per game, gain 7-X VP and 4X M€, where X is the current generation number.',
      },
    });
  }

  public generationUsed = -1;

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    player.stock.add(Resource.MEGACREDITS, 4 * player.game.generation, {log: true});
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
