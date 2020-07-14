import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { CardName } from '../CardName';
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class IceCapMelting implements IProjectCard {
    public cost: number = 5;
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.ICE_CAP_MELTING;
    public canPlay(player: Player, game: Game): boolean {
        const meetsTemperatureRequirements = game.getTemperature() >= 2 - (2 * player.getRequirementsBonus(game));
        const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST) && meetsTemperatureRequirements;
        }
    
        return meetsTemperatureRequirements;
    }
    public play(player: Player, game: Game) {
        game.addOceanInterrupt(player);
        return undefined;
    }
}
