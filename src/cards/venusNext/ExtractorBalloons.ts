import { IProjectCard } from "../IProjectCard";
import { IActionCard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { Game } from '../../Game';
import { CardName } from '../../CardName';

export class ExtractorBalloons implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.EXTRACTOR_BALLOONS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public play() {
        this.resourceCount += 3;
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }    
    public action(player: Player, game: Game) {
        if (this.resourceCount < 2) {
            this.resourceCount++;
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Remove 2 floaters to raise Venus scale 1 step", () => {
                this.resourceCount -= 2;
                game.increaseVenusScaleLevel(player,1);
                return undefined;
            }),
            new SelectOption("Add 1 floater to this card", () => {
                this.resourceCount++;
                return undefined;
            })
        );
    }
}