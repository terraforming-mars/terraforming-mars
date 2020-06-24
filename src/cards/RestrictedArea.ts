
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { CardName } from "../CardName";

export class RestrictedArea implements IActionCard, IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.ACTIVE;
    public name: CardName = CardName.RESTRICTED_AREA;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getAvailableSpacesOnLand(player).length > 0;
      }

    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for tile", game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.RESTRICTED_AREA });
            return undefined;
        });
    }
    public canAct(player: Player): boolean {
        return player.canAfford(2);
    }
    public action(player: Player, game: Game) {
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new SelectHowToPay("Select how to pay for action", false, false, true, 2, (htp) => {
                if (htp.heat + htp.megaCredits < 2) {
                    throw "Not enough spent";
                }
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                player.cardsInHand.push(game.dealer.dealCard());
                return undefined;
            });
        }
        player.megaCredits -= 2;
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
}
