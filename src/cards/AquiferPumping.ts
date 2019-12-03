import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {HowToPay} from '../inputs/HowToPay';
import {ISpace} from '../ISpace';
import {AndOptions} from '../inputs/AndOptions';
import {SelectSpace} from '../inputs/SelectSpace';
import {SelectHowToPay} from '../inputs/SelectHowToPay';


export class AquiferPumping implements IActionCard, IProjectCard {
    public cost: number = 18;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = 'Aquifer Pumping';
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
      return true;
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return (player.steelValue * player.steel) +
              player.megaCredits +
              (player.canUseHeatAsMegaCredits ? player.heat : 0) >= 8;
    }
    public action(player: Player, game: Game) {
      let howToPay: HowToPay;
      let foundSpace: ISpace;
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
            game.addOceanTile(player, foundSpace.id);
            return undefined;
          },
          new SelectSpace(
              'Select space for ocean tile',
              game.getAvailableSpacesForOcean(player),
              (space: ISpace) => {
                foundSpace = space;
                return undefined;
              }
          ),
          new SelectHowToPay(
              'Select how to pay for action', true, false,
              player.canUseHeatAsMegaCredits, false,
              (htp: HowToPay) => {
                howToPay = htp;
                return undefined;
              }
          )
      );
    }
}
