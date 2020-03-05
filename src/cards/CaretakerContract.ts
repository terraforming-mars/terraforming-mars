
import { IActionCard, ICard } from './ICard';
import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Tags} from './Tags';
import {Player} from '../Player';
import {Game} from '../Game';
import { CorporationName } from '../CorporationName';
import { AndOptions } from '../inputs/AndOptions';
import { SelectAmount } from '../inputs/SelectAmount';
import { CardName } from '../CardName';

export class CaretakerContract implements IActionCard, IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = CardName.CARETAKER_CONTRACT;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= 0 - (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.heat >= 8 || (player.isCorporation(CorporationName.STORMCRAFT_INCORPORATED) && (player.getResourcesOnCardname(CorporationName.STORMCRAFT_INCORPORATED) * 2) + player.heat >= 8 );
    }
    public action(player: Player) {
      if (player.isCorporation(CorporationName.STORMCRAFT_INCORPORATED) && player.getResourcesOnCardname(CorporationName.STORMCRAFT_INCORPORATED) > 0 ) {
        let heatAmount: number;
        let floaterAmount: number;
        return new AndOptions(
            () => {
              if (
                heatAmount +
                (floaterAmount * 2) < 8
              ) {
                throw new Error('Need to pay 8 heat');
              }
              player.removeResourceFrom(player.corporationCard as ICard, floaterAmount);
              player.heat -= heatAmount;
              player.terraformRating++;
              return undefined;
            },
            new SelectAmount("Select amount of heat to spend", (amount: number) => {
              heatAmount = amount;
              return undefined;
            }, player.heat),
            new SelectAmount("Select amount of floater on corporation to spend", (amount: number) => {
              floaterAmount = amount;
              return undefined;
            }, player.getResourcesOnCardname(CorporationName.STORMCRAFT_INCORPORATED))
        );
      }
      player.heat -= 8;
      player.terraformRating++;
      return undefined;
    }
}
