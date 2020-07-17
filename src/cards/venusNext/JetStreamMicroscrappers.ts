import { IProjectCard } from "../IProjectCard";
import { IActionCard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from '../../inputs/SelectOption';
import { Game } from '../../Game';
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from '../../constants';
import { CardName } from '../../CardName';
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

export class JetStreamMicroscrappers implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.JET_STREAM_MICROSCRAPPERS;
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
          return player.titanium > 0 || (canSpendResource && player.canAfford(REDS_RULING_POLICY_COST));
        }
  
        return player.titanium > 0 || canSpendResource;
    }

    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = [];

        const addResource = new SelectOption("Spend one titanium to add 2 floaters to this card", () => this.addResource(player));
        const spendResource = new SelectOption("Remove 2 floaters to raise Venus 1 step", () => this.spendResource(player, game));

        if (this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            opts.push(spendResource);
        } else {
            return this.addResource(player);
        }

        if (player.titanium > 0) {
            opts.push(addResource);
        } else {
            return this.spendResource(player, game);
        }

        return new OrOptions(...opts);
    }

    private addResource(player: Player) {
        this.resourceCount += 2;
        player.titanium--;
        return undefined;
    }

    private spendResource(player: Player, game: Game) {
        this.resourceCount -= 2;
        game.increaseVenusScaleLevel(player, 1);
        return undefined;
    }
}