import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {IColony} from '../../colonies/IColony';
import {SelectColony} from '../../inputs/SelectColony';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';

export class Maria extends CeoCard {
  constructor() {
    super({
      name: CardName.MARIA,
      metadata: {
        cardNumber: 'L13',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('X ').placeColony().colonies(1);
        }),
        description: 'Once per game, draw colony tiles equal to the current generation number. Put one into play and build a colony on it for free if possible.',
      },
    });
  }

  public override canAct(player: Player): boolean {
    const game = player.game;
    if (game.discardedColonies === undefined || !game.gameOptions.coloniesExtension) return false;
    return game.discardedColonies.length > 0 && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    if (game.discardedColonies.length === 0) return undefined;

    const count = Math.min(game.discardedColonies.length, player.game.generation);
    const availableColonies = game.discardedColonies.slice(0, count);
    availableColonies;
    const selectColony = new SelectColony('Select colony tile to add', 'Add colony tile', availableColonies, (colony: IColony) => {
      if (availableColonies.includes(colony)) {
        game.colonies.push(colony);
        game.colonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
        game.log('${0} added a new Colony tile: ${1}', (b) => b.player(player).colony(colony));
        // this.checkActivation(colony, player);
        if (colony.isActive) colony.addColony(player);
      } else {
        throw new Error(`Colony ${colony.name} is not a discarded colony`);
      }
      this.isDisabled = true;
      return undefined;
    });
    return selectColony;
  }

  // private checkActivation(colony: IColony, player: Player): void {
  //   const game = player.game;
  //   if (colony.isActive) return;
  //   for (const player of game.getPlayers()) {
  //     for (const card of player.tableau) {
  //       const active = ColoniesHandler.maybeActivateColony(colony, card);
  //       if (active) {
  //         return;
  //       }
  //     }
  //   }
  // }
}
