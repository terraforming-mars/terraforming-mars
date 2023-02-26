import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {multiplier} from '../Options';

export class Floyd extends CeoCard {
  constructor() {
    super({
      name: CardName.FLOYD,
      metadata: {
        cardNumber: 'L06',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.text('PLAY').cards(1).colon().megacredits(-13).megacredits(-2, {multiplier}).asterix();
          b.br.br;
        }),
        description: 'Once per game, play a card from hand for 13 + 2X M€ less, where X is the current generation number.',
      },
    });
  }

  public opgActionIsActive = false;

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.cardsInHand.length > 0;
  }

  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    this.opgActionIsActive = true;
    player.game.defer(new PlayProjectCard(player));
    player.game.defer(new SimpleDeferredAction(player, () => {
      return undefined;
    }));
    return undefined;
  }

  public override getCardDiscount(player: Player) {
    if (player.getActionsThisGeneration().has(this.name) && this.opgActionIsActive === true) {
      this.opgActionIsActive = false;
      return 13 + 2 * player.game.generation;
    }
    return 0;
  }
}
