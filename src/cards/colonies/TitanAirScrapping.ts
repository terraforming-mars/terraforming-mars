import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { IResourceCard } from '../ICard';
import { Game } from '../../Game';

export class TitanAirScrapping implements IProjectCard, IResourceCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: CardName = CardName.TITAN_AIRSCRAPPING;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(player: Player): boolean {
        return player.titanium > 0  || this.resourceCount >= 2;
    }

    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = [];

        const addResource = new SelectOption("Spend 1 titanium to add 2 floaters on this card", () => this.addResource(player));
        const spendResource = new SelectOption("Remove 2 floaters on this card to increase your TR 1 step", () => this.spendResource(player, game));

        if (this.resourceCount >= 2 && player.titanium > 0) {
            opts.push(spendResource);
            opts.push(addResource);
        } else if (player.titanium > 0) {
            this.addResource(player);
        } else {
            this.spendResource(player, game);
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
        player.increaseTerraformRating(game);
        return undefined;
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
        return 2;
    }
}