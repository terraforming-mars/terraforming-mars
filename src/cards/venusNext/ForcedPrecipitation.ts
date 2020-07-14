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
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from '../../constants';
import { CardName } from '../../CardName';
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

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
        const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
        const canSpendResource = this.resourceCount > 1 && !venusMaxed;
        
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
          return player.canAfford(2) || (canSpendResource && player.canAfford(REDS_RULING_POLICY_COST));
        }
  
        return player.canAfford(2) || canSpendResource;
    }  
    
    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = [];

        const addResource = new SelectOption("Pay 2 to add 1 floater to this card", () => this.addResource(player));
        const spendResource = new SelectOption("Remove 2 floaters to raise Venus 1 step", () => this.spendResource(player, game));

        if (this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            opts.push(spendResource);
        } else {
            return this.addResource(player);
        };

        if (player.canAfford(2)) {
            opts.push(addResource);
        } else {
            return this.spendResource(player, game);
        }

        return new OrOptions(...opts);
    }

    private addResource(player: Player) {
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
    }

    private spendResource(player: Player, game: Game) {
        player.removeResourceFrom(this,2);
        game.increaseVenusScaleLevel(player, 1);
        return undefined;
    }
}