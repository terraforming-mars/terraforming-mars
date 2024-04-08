import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';

export class Maria extends CeoCard {
  constructor() {
    super({
      name: CardName.MARIA,
      metadata: {
        cardNumber: 'L13',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('X ').colonyTile().colonies(1);
        }),
        description: 'Once per game, draw colony tiles equal to the current generation number. Put one into play and build a colony on it for free if possible.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    const game = player.game;
    if (game.discardedColonies === undefined || !game.gameOptions.coloniesExtension) return false;
    return game.discardedColonies.length > 0 && this.isDisabled === false;
  }

  public action(player: IPlayer): undefined {
    const game = player.game;
    const count = Math.min(game.discardedColonies.length, player.game.generation);
    const availableColonies = game.discardedColonies.slice(0, count);

    this.isDisabled = true;
    ColoniesHandler.addColonyTile(player, {
      colonies: availableColonies, cb: (colony) => {
        if (colony.isActive) {
          colony.addColony(player);
        }
      }});
    return undefined;
  }
}
