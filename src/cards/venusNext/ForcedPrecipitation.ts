import { IProjectCard } from "../IProjectCard";
import { IActionCard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { SelectHowToPay } from '../../inputs/SelectHowToPay';
import { OrOptions } from '../../inputs/OrOptions';
import { SelectOption } from '../../inputs/SelectOption';
import { Game } from '../../Game';
import { MAX_VENUS_SCALE } from '../../constants';
import { CardName } from '../../CardName';

export class ForcedPrecipitation implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.FORCED_PRECIPITATION;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public play() {
        return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
        return player.canAfford(2) || 
          (this.resourceCount > 1 &&  game.getVenusScaleLevel() < MAX_VENUS_SCALE);
    }  
    
    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = []; 
        const addResource = new SelectOption("Pay 2 to add 1 floater to this card", () => {
            if (player.canUseHeatAsMegaCredits && player.heat > 0) {
                return new SelectHowToPay(
                    'Select how to pay ', false, false,
                    player.canUseHeatAsMegaCredits,
                    2,
                    (htp) => {
                        if (htp.heat + htp.megaCredits < 2) {
                            throw new Error('Not enough for action');
                        }
                        player.megaCredits -= htp.megaCredits;
                        player.heat -= htp.heat;
                        this.resourceCount++;
                        return undefined;
                    }
                );
            }
            player.megaCredits -= 2;
            this.resourceCount++;
            return undefined;
        });

        const spendResource = new SelectOption("Remove 2 floaters to raise Venus 1 step", () => {
            player.removeResourceFrom(this,2);
            game.increaseVenusScaleLevel(player, 1);
            return undefined;
        });

        if (this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            opts.push(spendResource);
        } else return addResource;

        if (player.canAfford(2)) {
            opts.push(addResource);
        } else return spendResource;

        return new OrOptions(...opts);
    }
}