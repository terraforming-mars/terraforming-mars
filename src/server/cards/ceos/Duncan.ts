import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Resources} from '../../../common/Resources';
import {multiplier} from '../Options';


// TODO: Does Duncan trigger Vitor?
export class Duncan extends Card implements CeoCard {
  constructor() {
    super({
      name: CardName.DUNCAN,
      cardType: CardType.CEO,
      metadata: {
        cardNumber: 'L04',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().vpIcon().asterix().megacredits(4, {multiplier});
          b.br;
        }),
        description: 'Once per game, gain 6-X VP and 4X M€, where X is the current generation number.',
      },
    });
  }

  public isDisabled = false;
  public generationUsed = -1;
  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    player.addResource(Resources.MEGACREDITS, 4 * player.game.generation, {log: true});
    this.isDisabled = true;
    this.generationUsed = player.game.generation;
    return undefined;
  }
}
