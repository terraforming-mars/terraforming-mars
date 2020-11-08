import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { PlaceOceanTile } from "../deferredActions/PlaceOceanTile";

export class SubterraneanReservoir implements IProjectCard {
    public cost = 11;
    public cardType = CardType.EVENT;
    public tags = [];
    public name = CardName.SUBTERRANEAN_RESERVOIR;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
  
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST);
        }
  
        return true;
    }

    public play(player: Player, game: Game) {
        game.defer(new PlaceOceanTile(player, game));
        return undefined;
    }
}

