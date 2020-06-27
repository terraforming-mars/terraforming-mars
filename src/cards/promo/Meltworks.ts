import { IActionCard, ICard } from "./../ICard";
import { IProjectCard } from "./../IProjectCard";
import { Tags } from "./../Tags";
import { CardType } from "./../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from '../../CardName';
import { AndOptions } from "../../inputs/AndOptions";
import { SelectAmount } from "../../inputs/SelectAmount";

export class Meltworks implements IActionCard, IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MELTWORKS;
    public cardType: CardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.heat >= 5 || (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) && (player.getResourcesOnCorporation() * 2) + player.heat >= 5 );
    }
    public action(player: Player) {
        if (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) && player.getResourcesOnCorporation() > 0) {
          let heatAmount: number;
          let floaterAmount: number;

          return new AndOptions(
              () => {
                if (heatAmount + (floaterAmount * 2) < 5) {
                  throw new Error('Need to pay 5 heat');
                }
                player.removeResourceFrom(player.corporationCard as ICard, floaterAmount);
                player.heat -= heatAmount;
                player.steel += 3;
                return undefined;
              },
              new SelectAmount("Select amount of heat to spend", (amount: number) => {
                heatAmount = amount;
                return undefined;
              }, player.heat),
              new SelectAmount("Select amount of floater on corporation to spend", (amount: number) => {
                floaterAmount = amount;
                return undefined;
              }, player.getResourcesOnCorporation()),
          );
        }

        player.heat -= 5;
        player.steel += 3;
        return undefined;
    }
}
