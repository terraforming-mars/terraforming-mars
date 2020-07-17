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
        const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
        const canSpendResource = this.resourceCount > 0 && !venusMaxed;
        
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
          return player.canAfford(6, game, false, true) || (canSpendResource && player.canAfford(REDS_RULING_POLICY_COST));
        }
  
        return player.canAfford(6, game, false, true) || canSpendResource;
    }  
    
    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = [];

        const addResource = new SelectOption("Pay 6 to add 1 asteroid to this card", () => this.addResource(player, game));
        const spendResource = new SelectOption("Remove 1 asteroid to raise Venus 1 step", () => this.spendResource(player, game));

        if (this.resourceCount > 0 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            opts.push(spendResource);
        } else {
            return this.addResource(player, game);
        }

        if (player.canAfford(6, game, false, true)) {
            opts.push(addResource);
        } else {
            return this.spendResource(player, game);
        }
        
        return new OrOptions(...opts);
    }

    private addResource(player: Player, game: Game) {
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
    }

    private spendResource(player: Player, game: Game) {
        player.removeResourceFrom(this);
        game.increaseVenusScaleLevel(player, 1);
        return undefined;
    }
}