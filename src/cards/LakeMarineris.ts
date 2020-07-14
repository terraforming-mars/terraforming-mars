import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class LakeMarineris implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.LAKE_MARINERIS;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        const meetsTemperatureRequirements = game.getTemperature() >= 0 - (2 * player.getRequirementsBonus(game));
        const remainingOceans = MAX_OCEAN_TILES - game.board.getOceansOnBoard();
        const oceansPlaced = Math.min(remainingOceans, 2);
  
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST * oceansPlaced) && meetsTemperatureRequirements;
        }
  
        return meetsTemperatureRequirements;
    }

    public play(player: Player, game: Game) {
        game.addOceanInterrupt(player, "Select space for first ocean");
        game.addOceanInterrupt(player, "Select space for second ocean");
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}
