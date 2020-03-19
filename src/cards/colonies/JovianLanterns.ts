import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { IResourceCard } from '../ICard';

export class JovianLanterns implements IProjectCard, IResourceCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: CardName = CardName.JOVIAN_LANTERNS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.JOVIAN) >= 1;
    }

    public canAct(player: Player): boolean {
        return player.titanium > 0;
    }

    public action(player: Player) {
        player.titanium--;
        player.addResourceTo(this,2);
        return undefined;
    }

    public play(player: Player, game: Game) {
      game.addResourceInterrupt(player, ResourceType.FLOATER, 2, this);
      player.terraformRating++;
      return undefined;
    }

    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 2);
    }
}