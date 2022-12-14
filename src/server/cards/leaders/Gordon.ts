import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import {Board} from '../../boards/Board';
import {ISpace} from '../../boards/ISpace';
import {GainResources} from '../../deferredActions/GainResources';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {SpaceType} from '../../../common/boards/SpaceType';

export class Gordon extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.GORDON,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L07',
        renderData: CardRenderer.builder((b) => {
          b.greenery().city().colon().megacredits(2).asterix();
          b.br.br;
        }),
        description: 'Ignore placement restrictions for greenery and city tiles on Mars. Gain 2 M€ when you place a greenery or city tile on Mars.',
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

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id !== activePlayer.id) return;
    if (space.spaceType === SpaceType.COLONY) return;

    if (Board.isCitySpace(space) || Board.isGreenerySpace(space)) {
      cardOwner.game.defer(new GainResources(cardOwner, Resources.MEGACREDITS, {count: 2}));
    }
    return;
  }
}
