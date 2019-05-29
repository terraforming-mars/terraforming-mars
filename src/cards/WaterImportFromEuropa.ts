
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { SpaceType } from "../SpaceType";
import { PlayerInput } from "../PlayerInput";
import { HowToPay } from "../inputs/HowToPay";
import { SelectHowToPay } from "../inputs/SelectHowToPay";

export class WaterImportFromEuropa implements IActionCard, IProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Water Import From Europa";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Pay 12 mega credit to place an ocean tile. Titanium may be used as if playing a space card";
    public text: string = "Gain 1 victory point for each jovian tag you have";
    public description: string = "With its low gravity, this Jovian ice moon is suitable for mass export of water";
    public canPlay(_player: Player, _game: Game): boolean {
        return true;
    }
    public play(player: Player, game: Game): PlayerInput | undefined {
        game.addGameEndListener(() => {
            player.victoryPoints += player.getTagCount(Tags.JOVIAN);
        });
        return undefined;
    }
    public canAct(player: Player): boolean {
        return (player.canUseHeatAsMegaCredits ? player.heat : 0) + player.megaCredits + (player.titanium * player.titaniumValue) >= 12;
    }
    public action(player: Player, game: Game) {
        let htp: HowToPay;
        let selectedSpace: ISpace;
        return new AndOptions(
            () => {
                if ((player.canUseHeatAsMegaCredits ? htp.heat : 0) + htp.megaCredits + (htp.titanium * player.titaniumValue) < 12) {
                    throw "Need to spend at least 12";
                }
                game.addOceanTile(player, selectedSpace.id);
                player.titanium -= htp.titanium;
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                return undefined;
            },
            new SelectHowToPay("Select how to pay for action", false, true, player.canUseHeatAsMegaCredits, (howToPay: HowToPay) => {
                htp = howToPay;
                return undefined;
            }),
            new SelectSpace("Select where to place ocean", game.getSpaces(SpaceType.OCEAN).filter((space) => space.tile === undefined && space.player === undefined), (space: ISpace) => {
                selectedSpace = space;
                return undefined;
            })
        );
    }
}
