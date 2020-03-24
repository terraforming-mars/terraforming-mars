import { IProjectCard } from "../IProjectCard";
import { IActionCard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from '../../inputs/SelectOption';
import { Game } from '../../Game';
import { MAX_VENUS_SCALE } from '../../constants';
import { CardName } from '../../CardName';

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
        return player.titanium > 0 || 
          (this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE);
    }    
    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = [];
        const addResource = new SelectOption("Spend one titanium to add 2 floaters to this card", () => {
            this.resourceCount += 2;
            player.titanium--;
            return undefined;
        });

        const spendResource = new SelectOption("Remove 2 floaters to raise Venus 1 step", () => {
            this.resourceCount -= 2;
            game.increaseVenusScaleLevel(player, 1);
            return undefined;
        });

        if (player.titanium > 0) {
            opts.push(addResource);
        } else return spendResource;

        if (this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            opts.push(spendResource);
        } else return addResource;

        return new OrOptions(...opts);

    }
}