import { Colony, IColony } from "../../colonies/Colony";
import { Player } from "../../Player";
import { PlayerInput } from "../../PlayerInput";
import { Game } from "../../Game";
import { ColonyName } from "../../colonies/ColonyName";
import { MAX_COLONY_TRACK_POSITION } from "../../constants";
import { SelectPlayer } from "../../inputs/SelectPlayer";
import { Resources } from "../../Resources";
import { DeferredAction } from "../../deferredActions/DeferredAction";
import { DiscardCards } from "../../deferredActions/DiscardCards";
import { StealResources } from "../../deferredActions/StealResources";
import { IncreaseColonyTrack } from "../../deferredActions/IncreaseColonyTrack";

export class Hygiea extends Colony implements IColony {
    public name = ColonyName.HYGIEA;
    public description: string = "Attack";

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (player.colonyTradeOffset && usesTradeFleet) {
            game.defer(new IncreaseColonyTrack(
                player,
                game,
                this,
                () => this.handleTrade(player, game, usesTradeFleet)
            ));
        } else {
            this.handleTrade(player, game, usesTradeFleet);
        }
    }

    private handleTrade(player: Player, game: Game, usesTradeFleet: boolean) {
        if (this.trackPosition <= 1) {
            game.defer(new StealResources(player, game, Resources.MEGACREDITS, 3));
        } else if (this.trackPosition === 2) {
            game.defer(new StealResources(player, game, Resources.HEAT, 3));
        } else if (this.trackPosition === 3) {
            game.defer(new StealResources(player, game, Resources.ENERGY, 3));
        } else if (this.trackPosition === 4) {
            game.defer(new StealResources(player, game, Resources.PLANTS, 3));
        } else if (this.trackPosition === 5) {
            game.defer(new StealResources(player, game, Resources.STEEL, 3));
        } else if (this.trackPosition === MAX_COLONY_TRACK_POSITION) {
            game.defer(new StealResources(player, game, Resources.TITANIUM, 3));
        }

        if (usesTradeFleet) this.afterTrade(this, player, game);
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        
        if (game.isSoloMode()) return undefined;
        
        game.defer(new DeferredAction(
            player,
            () => {
                const playersWithCards = game.getPlayers().filter((p) => p.cardsInHand.length > 0);
                if (playersWithCards.length === 0) return undefined;

                return new SelectPlayer(
                    playersWithCards,
                    "Select player to discard a card",
                    "Select",
                    (selectedPlayer: Player) => {
                        game.defer(new DiscardCards(selectedPlayer, game, 1, "Hygiea colony effect. Select a card to discard"));
                        return undefined;
                    }
                );
            }
        ));

        return undefined;
    }
    
    public giveTradeBonus(player: Player): undefined | PlayerInput {
        player.megaCredits += 3;
        return undefined;
    }   
}
