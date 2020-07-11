import { IProjectCard } from "../IProjectCard";
import { IActionCard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { Game } from '../../Game';
import { CardName } from '../../CardName';

export class VenusianInsects implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.VENUS, Tags.MICROBES];
    public name: CardName = CardName.VENUSIAN_INSECTS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 12 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }   
    public action(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 2);
    }
}