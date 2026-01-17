import {CardName} from '@/common/cards/CardName';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {CeoCard} from '@/server/cards/ceos/CeoCard';
import {PreludesExpansion} from '@/server/preludes/PreludesExpansion';

export class Karen extends CeoCard {
  constructor() {
    super({
      name: CardName.KAREN,
      metadata: {
        cardNumber: 'L11',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('X').prelude().asterix();
        }),
        description: 'Once per game, draw Prelude cards equal to the current generation number and choose one to play, and discard the rest.',
      },
    });
  }

  public override canAct(player: IPlayer) {
    if (!player.game.preludeDeck.canDraw(player.game.generation)) {
      this.warnings.add('deckTooSmall');
    }
    return super.canAct(player);
  }
  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const cards = game.preludeDeck.drawN(game, game.generation);
    return PreludesExpansion.selectPreludeToPlay(player, cards, 'discard');
  }
}
