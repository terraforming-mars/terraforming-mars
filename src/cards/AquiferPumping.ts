import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {HowToPay} from '../inputs/HowToPay';
import {AndOptions} from '../inputs/AndOptions';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import * as constants from '../constants';
import { CardName } from '../CardName';


export class AquiferPumping implements IActionCard, IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.AQUIFER_PUMPING;
    public cardType: CardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
      return player.canAfford(8, game, true, false) && game.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES;
    }
    public action(player: Player, game: Game) {
      let howToPay: HowToPay;
      return new AndOptions(
          () => {
            if (
              (howToPay.steel * player.steelValue) +
              howToPay.megaCredits +
              howToPay.heat < 8
            ) {
              throw new Error('Need to pay 8');
            }
            player.steel -= howToPay.steel;
            player.heat -= howToPay.heat;
            player.megaCredits -= howToPay.megaCredits;
            game.addOceanInterrupt(player);
            return undefined;
          },
          new SelectHowToPay(
              'Select how to pay for action', true, false,
              player.canUseHeatAsMegaCredits, 8,
              (htp: HowToPay) => {
                howToPay = htp;
                return undefined;
              }
          )
      );
    }
}
