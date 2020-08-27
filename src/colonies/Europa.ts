import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { Game } from '../Game';
import { ColonyName } from './ColonyName';
import { LogHelper } from '../components/LogHelper';
import { OrOptions } from '../inputs/OrOptions';
import { SelectOption } from '../inputs/SelectOption';

export class Europa extends Colony implements IColony {
    public name = ColonyName.EUROPA;
    public description: string = "Production";
    public trade(player: Player, game: Game): void {
        if (player.colonyTradeOffset > 0) {
            game.addInterrupt({ player, playerInput: new OrOptions(
                new SelectOption("Increase colony track", "Confirm", () => {
                    this.beforeTrade(this, player, game);
                    this.handleTrade(game, player);
                    return undefined;
                }),
                new SelectOption("Do nothing", "Confirm", () => {
                    this.handleTrade(game, player);
                    return undefined;
                })
            )});
        } else {
            this.handleTrade(game, player);
        }
    }

    private handleTrade(game: Game, player: Player) {
        if (this.trackPosition < 2) {
            player.setProduction(Resources.MEGACREDITS);
            LogHelper.logGainProduction(game, player, Resources.MEGACREDITS);
        } else if (this.trackPosition < 4) {
            player.setProduction(Resources.ENERGY);
            LogHelper.logGainProduction(game, player, Resources.ENERGY);
        } else {
            player.setProduction(Resources.PLANTS);
            LogHelper.logGainProduction(game, player, Resources.PLANTS);
        }
        this.afterTrade(this, player, game);
    }


    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        game.addOceanInterrupt(player, 'Select ocean for Europa colony')
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.megaCredits++;
    }    
}