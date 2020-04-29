
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { HowToPay } from "../inputs/HowToPay";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { MAX_OCEAN_TILES } from '../constants';
import { CardName } from '../CardName';

export class WaterImportFromEuropa implements IActionCard, IProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.WATER_IMPORT_FROM_EUROPA;
    public cardType: CardType = CardType.ACTIVE;

    public getVictoryPoints(player: Player) {
        return player.getTagCount(Tags.JOVIAN, false, false);
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
        return (player.canAfford(12, game, false, true) && game.board.getOceansOnBoard() < MAX_OCEAN_TILES);
    }
    public action(player: Player, game: Game) {
        let htp: HowToPay;
        return new AndOptions(
            () => {
                if ((player.canUseHeatAsMegaCredits ? htp.heat : 0) + htp.megaCredits + (htp.titanium * player.getTitaniumValue(game)) < 12) {
                    throw "Need to spend at least 12";
                }
                game.addOceanInterrupt(player);
                player.titanium -= htp.titanium;
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                return undefined;
            },
            new SelectHowToPay("Select how to pay for action", false, true, player.canUseHeatAsMegaCredits, 12, (howToPay: HowToPay) => {
                htp = howToPay;
                return undefined;
            })
        );
    }
}
