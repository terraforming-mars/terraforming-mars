import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import {Game} from '../../Game';
import {Resources} from '../../../common/Resources';

export class VanAllen extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.VANALLEN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L22',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.text('MILESTONES: ').megacredits(0, {cancelled: true}).megacredits(3).asterix();
          b.br.br;
        }),
        description: 'You may claim milestones for free (you must still meet the requirements). When any milestone is claimed, gain 3 M€.',
      },
    });
  }

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return false;
  }

  public action(): PlayerInput | undefined {
    return undefined;
  }

  public static onMilestoneClaimed(game: Game) {
    const owner = game.getPlayers().find((player) => player.cardIsInEffect(CardName.VANALLEN));
    if (owner === undefined) return;

    owner.addResource(Resources.MEGACREDITS, 3, {log: true});
    return undefined;
  }
}
