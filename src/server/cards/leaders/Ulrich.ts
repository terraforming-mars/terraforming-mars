import {MAX_OCEAN_TILES} from '@/common/constants'; 
import {LeaderCard} from './LeaderCard';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';

import {CardType} from '../../../common/cards/CardType';
import {Resources} from '../../../common/Resources';

export class Ulrich extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.ULRICH,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L21',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().oceans(1).colon().megacredits(4).multiplierWhite().slash().megacredits(15).asterix();
        }),
        description: 'Once per game, gain 4 M€ for each ocean placed. If all oceans are aleady placed, gain only 15 M€.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const oceansPlaced = game.board.getOceanCount()
    if (oceansPlaced < MAX_OCEAN_TILES) {
      const oceansPlaced = game.board.getOceanCount();
      player.addResource(Resources.MEGACREDITS, oceansPlaced * 4, {log: true});
    } else {
      player.addResource(Resources.MEGACREDITS, 15, {log: true});
    }

    this.isDisabled = true;
    return undefined;
  }
}
