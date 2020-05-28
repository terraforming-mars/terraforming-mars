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

export class RotatorImpacts implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.ROTATOR_IMPACTS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() - (2 * player.getRequirementsBonus(game)) <= 14;
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
        return player.canAfford(6, game, false, true) || 
          (this.resourceCount > 0 && game.getVenusScaleLevel() < MAX_VENUS_SCALE);
    }  
    
    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = []; 
        const addResource = new SelectOption("Pay 6 to add 1 asteroid to this card", () => {
            return new SelectHowToPay(
                'Select how to pay ', false, true,
                player.canUseHeatAsMegaCredits,
                6,
                (htp) => {
                    if (htp.heat + htp.megaCredits + htp.titanium * player.getTitaniumValue(game) < 6) {
                        throw new Error('Not enough for action');
                    }
                    player.megaCredits -= htp.megaCredits;
                    player.heat -= htp.heat;
                    player.titanium -= htp.titanium;
                    this.resourceCount++;
                    return undefined;
                }
            );
        });

        const spendResource = new SelectOption("Remove 1 asteroid to raise Venus 1 step", () => {
            player.removeResourceFrom(this);
            game.increaseVenusScaleLevel(player, 1);
            return undefined;
        });

        if (player.canAfford(6, game, false, true)) {
            opts.push(addResource);
        };

        if (this.resourceCount > 0 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            opts.push(spendResource);
        };

        if (opts.length === 0) return undefined;

        if (opts.length === 1) return opts[0];

        return new OrOptions(...opts);
    }
}