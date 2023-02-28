import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Resources} from '../../../common/Resources';
import {MAX_OCEAN_TILES} from '../../../common/constants';
import {multiplier} from '../Options';

export class Ulrich extends CeoCard {
  constructor() {
    super({
      name: CardName.ULRICH,
      metadata: {
        cardNumber: 'L21',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().oceans(1).colon().megacredits(4, {multiplier}).slash().megacredits(15).asterix();
        }),
        description: 'Once per game, gain 4 M€ for each ocean placed. If all oceans are aleady placed, gain only 15 M€.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const oceansPlaced = game.board.getOceanCount();
    const bonusCredits = oceansPlaced < MAX_OCEAN_TILES ? (oceansPlaced * 4) : 15;
    player.addResource(Resources.MEGACREDITS, bonusCredits, {log: true});
    return undefined;
  }
}
