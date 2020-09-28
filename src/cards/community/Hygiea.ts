import { Colony, IColony } from '../../colonies/Colony';
import { Player } from '../../Player';
import { Game } from '../../Game';
import { ColonyName } from '../../colonies/ColonyName';
import { MAX_COLONY_TRACK_POSITION } from '../../constants';
import { SelectPlayer } from '../../inputs/SelectPlayer';
import { SelectDiscard } from '../../interrupts/SelectDiscard';
import { Resources } from '../../Resources';

export class Hygiea extends Colony implements IColony {
    public name = ColonyName.HYGIEA;
    public description: string = "Attack";

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) this.beforeTrade(this, player, game);

        const isSoloMode = game.isSoloMode();
        const availableTargets = game.getPlayers().filter((p) => p.name !== player.name);
        
        if (this.trackPosition <= 1) {
            if (isSoloMode) {
                player.megaCredits += 3;
            } else {
                game.interrupts.push({
                    player: player,
                    playerInput: new SelectPlayer(
                        availableTargets,
                        "Select player to steal 3 MC from",
                        "Select",
                        (selectedPlayer: Player) => {
                            const amountStolen = Math.min(3, selectedPlayer.megaCredits);
                            selectedPlayer.setResource(Resources.MEGACREDITS, -amountStolen, game, player);
                            player.megaCredits += amountStolen;
                            return undefined;
                        }
                    )
                });
            }
        } else if (this.trackPosition === 2) {
            if (isSoloMode) {
                player.heat += 3;
            } else {
                game.interrupts.push({
                    player: player,
                    playerInput: new SelectPlayer(
                        availableTargets,
                        "Select player to steal 3 heat from",
                        "Select",
                        (selectedPlayer: Player) => {
                            const amountStolen = Math.min(3, selectedPlayer.heat);
                            selectedPlayer.setResource(Resources.HEAT, -amountStolen, game, player);
                            player.heat += amountStolen;
                            return undefined;
                        }
                    )
                });
            }
        } else if (this.trackPosition === 3) {
            if (isSoloMode) {
                player.energy += 3;
            } else {
                game.interrupts.push({
                    player: player,
                    playerInput: new SelectPlayer(
                        availableTargets,
                        "Select player to steal 3 energy from",
                        "Select",
                        (selectedPlayer: Player) => {
                            const amountStolen = Math.min(3, selectedPlayer.energy);
                            selectedPlayer.setResource(Resources.ENERGY, -amountStolen, game, player);
                            player.energy += amountStolen;
                            return undefined;
                        }
                    )
                });
            }
        } else if (this.trackPosition === 4) {
            if (isSoloMode) {
                player.plants += 3;
            } else {
                game.interrupts.push({
                    player: player,
                    playerInput: new SelectPlayer(
                        availableTargets,
                        "Select player to steal 3 plants from",
                        "Select",
                        (selectedPlayer: Player) => {
                            const amountStolen = Math.min(3, selectedPlayer.plants);
                            selectedPlayer.setResource(Resources.PLANTS, -amountStolen, game, player);
                            player.plants += amountStolen;
                            return undefined;
                        }
                    )
                });
            }
        } else if (this.trackPosition === 5) {
            if (isSoloMode) {
                player.steel += 3;
            } else {
                game.interrupts.push({
                    player: player,
                    playerInput: new SelectPlayer(
                        availableTargets,
                        "Select player to steal 3 steel from",
                        "Select",
                        (selectedPlayer: Player) => {
                            const amountStolen = Math.min(3, selectedPlayer.steel);
                            selectedPlayer.setResource(Resources.STEEL, -amountStolen, game, player);
                            player.steel += amountStolen;
                            return undefined;
                        }
                    )
                });
            }
        } else if (this.trackPosition === MAX_COLONY_TRACK_POSITION) {
            if (isSoloMode) {
                player.titanium += 3;
            } else {
                game.interrupts.push({
                    player: player,
                    playerInput: new SelectPlayer(
                        availableTargets,
                        "Select player to steal 3 titanium from",
                        "Select",
                        (selectedPlayer: Player) => {
                            const amountStolen = Math.min(3, selectedPlayer.titanium);
                            selectedPlayer.setResource(Resources.TITANIUM, -amountStolen, game, player);
                            player.titanium += amountStolen;
                            return undefined;
                        }
                    )
                });
            }
        }

        if (usesTradeFleet) this.afterTrade(this, player, game);
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        
        const playersWithCards = game.getPlayers().filter((p) => p.cardsInHand.length > 0);
        if (game.isSoloMode() || playersWithCards.length === 0) return undefined;
        
        game.interrupts.push({
            player: player,
            playerInput: new SelectPlayer(
                playersWithCards,
                "Select player to discard a card",
                "Select",
                (selectedPlayer: Player) => {
                    game.addInterrupt(new SelectDiscard(selectedPlayer, game, "Hygiea colony effect. Select a card to discard", false));
                    return undefined;
                }
            )
        });

        return undefined;
    }
    
    public giveTradeBonus(player: Player): void {
        player.megaCredits += 3;
    }   
}