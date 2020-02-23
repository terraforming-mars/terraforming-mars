import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';

export class FloaterTechnology implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = CardName.FLOATER_TECHNOLOGY;
    public cardType: CardType = CardType.ACTIVE;

    public canAct(player: Player): boolean {
        return player.getResourceCards(ResourceType.FLOATER).length > 0;
    } 

    public action(player: Player, game: Game) {
        game.addResourceInterrupt(player, ResourceType.FLOATER);
        return undefined;
    } 

    public play() {
      return undefined;
    }
}

