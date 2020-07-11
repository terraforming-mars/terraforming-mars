import { IProjectCard } from '../IProjectCard';
import { IActionCard, IResourceCard } from '../ICard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { ResourceType } from '../../ResourceType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Game } from '../../Game';

export class Penguins implements IActionCard, IProjectCard, IResourceCard {

    public name: CardName = CardName.PENGUINS;
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 8 - player.getRequirementsBonus(game);
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
        return this.resourceCount;
    }

}