import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import { Resources } from '../../../common/Resources';
import { MAX_OCEAN_TILES } from '../../../common/constants';

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
    let oceansPlaced = game.board.getOceanCount()
    let bonus_credits = 15  // Default to 15, this happens if all oceans have been placed
    if (oceansPlaced < MAX_OCEAN_TILES) {
      bonus_credits = oceansPlaced * 4
    }
    player.addResource(Resources.MEGACREDITS, bonus_credits, {log: true});
    this.isDisabled = true;
    return undefined;
  }
}
