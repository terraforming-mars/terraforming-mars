import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';

export class Floyd extends CeoCard {
  constructor() {
    super({
      name: CardName.FLOYD,
      metadata: {
        cardNumber: 'L06',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.text('PLAY').cards(1).colon().megacredits(-13).megacredits(1, {text: '-2x'}).asterix();
          b.br.br;
        }),
        description: 'Once per game, play a card from hand for 13 + 2X M€ less, where X is the current generation number.',
      },
    });
  }

  public opgActionIsActive = false;

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.cardsInHand.length > 0;
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    this.opgActionIsActive = true;
    player.game.defer(new PlayProjectCard(player))
      .andThen(() => this.opgActionIsActive = false);
    return undefined;
  }

  public override getCardDiscount(player: IPlayer) {
    if (this.opgActionIsActive === true) {
      return 13 + (2 * player.game.generation);
    }
    return 0;
  }
}
