import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';
import {IColony} from '../../colonies/IColony';
import {SelectColony} from '../../inputs/SelectColony';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';


export class Maria extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.MARIA,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L13',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('X ').placeColony().colonies(1);
        }),
        description: 'Once per game, draw colony tiles equal to the current generation number. Put one into play and build a colony on it for free if possible.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const game = player.game;
    if (game.discardedColonies === undefined || !game.gameOptions.coloniesExtension) return false;
    return game.discardedColonies.length > 0 && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    if (game.discardedColonies.length === 0) return undefined;

    const count = Math.min(game.discardedColonies.length, player.game.generation);
    const availableColonies = game.discardedColonies.slice(0, count);

    const selectColony = new SelectColony('Select colony tile to add', 'Add colony tile', availableColonies, (colony: IColony) => {
      if (availableColonies.includes(colony)) {
        game.colonies.push(colony);
        game.colonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
        game.log('${0} added a new Colony tile: ${1}', (b) => b.player(player).colony(colony));
        this.checkActivation(colony, player);
        // TODO(kberg): remove this colony from discarded?
        if (colony.isActive) colony.addColony(player);
      } else {
        throw new Error(`Colony ${colony.name} is not a discarded colony`);
      }
      this.isDisabled = true;
      return undefined;
    });
    return selectColony;
  }

  private checkActivation(colony: IColony, player: Player): void {
    const game = player.game;
    if (colony.isActive) return;
    for (const player of game.getPlayers()) {
      for (const card of player.tableau) {
        const active = ColoniesHandler.maybeActivateColony(colony, card);
        if (active) {
          return;
        }
      }
    }
  }
}

  //   return new SelectColony('Select colony tile to add', 'Add colony tile', coloniesModel, (colonyName: ColonyName) => {
  //     if (game.colonyDealer !== undefined) {
  //       availableColonies.forEach((colony) => {
  //         if (colony.name === colonyName) {
  //           game.colonies.push(colony);
  //           game.colonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
  //           game.colonyDealer?.discardedColonies.splice(game.colonyDealer?.discardedColonies.indexOf(colony), 1);
  //           game.log('${0} added a new Colony tile: ${1}', (b) => b.player(player).colony(colony));

  //           game.defer(new DeferredAction(player, () => {
  //             Aridor.checkActivation(colony, game);

  //             // Activate Venus colony
  //             if (colony.name === ColonyName.VENUS) {
  //               game.getPlayers().forEach((player) => {
  //                 if (player.playedCards.some((card) => card.tags.includes(Tags.VENUS) && card.resourceType !== undefined)) {
  //                   colony.isActive = true;
  //                 }
  //               })
  //             }

  //             if (colony.isActive) colony.addColony(player);
  //             this.isDisabled = true;
  //             return undefined;
  //           }));

  //           return undefined;
  //         }
  //         return undefined;
  //       });
  //       return undefined;
  //     } else {
  //       return undefined;
  //     };
  //   });
  // }
