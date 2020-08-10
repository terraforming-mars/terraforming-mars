
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from '../constants';
import { CardName } from '../CardName';
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

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
        const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
        if (oceansMaxed) return false;
  
        let oceanCost = 12;
  
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(oceanCost + REDS_RULING_POLICY_COST, game, false, true);
        }
  
        return player.canAfford(oceanCost, game, false, true);;
    }
    public action(player: Player, game: Game) {
        game.addOceanInterrupt(player);
        game.addSelectHowToPayInterrupt(player, 12, false, true, "Select how to pay for action");
        return undefined;        
    }
}
