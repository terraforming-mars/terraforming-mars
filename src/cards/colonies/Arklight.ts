import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { ResourceType } from '../../ResourceType';
import { IProjectCard } from '../IProjectCard';
import { Resources } from '../../Resources';
import { Game } from '../../Game';
import { CardName } from '../../CardName';
import { IResourceCard } from '../ICard';
import {CorporationName} from "../../CorporationName";

export class Arklight implements CorporationCard, IResourceCard {
    public name: CardName =  CardName.ARKLIGHT;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public startingMegaCredits: number = 45;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;

    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS, 2);
        player.addResourceTo(this);
        return undefined;
    }

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
        if (player.isCorporation(CorporationName.ARKLIGHT)) {
            player.addResourceTo(this, card.tags.filter((cardTag) => cardTag === Tags.ANIMAL || cardTag === Tags.PLANT).length);
        }
      }

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 2);
    }
}
