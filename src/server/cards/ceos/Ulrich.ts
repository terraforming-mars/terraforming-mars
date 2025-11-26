import {CardName} from '@/common/cards/CardName';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {CeoCard} from '@/server/cards/ceos/CeoCard';
import {Resource} from '@/common/Resource';
import {MAX_OCEAN_TILES} from '@/common/constants';

export class Ulrich extends CeoCard {
  constructor() {
    super({
      name: CardName.ULRICH,
      metadata: {
        cardNumber: 'L21',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().oceans(1).colon().megacredits(1, {text: '4x'}).slash().megacredits(15).asterix();
        }),
        description: 'Once per game, gain 4 M€ for each ocean placed. If all oceans are aleady placed, gain only 15 M€.',
      },
    });
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const oceansPlaced = game.board.getOceanSpaces().length;
    const bonusCredits = oceansPlaced < MAX_OCEAN_TILES ? (oceansPlaced * 4) : 15;
    player.stock.add(Resource.MEGACREDITS, bonusCredits, {log: true});
    return undefined;
  }
}
