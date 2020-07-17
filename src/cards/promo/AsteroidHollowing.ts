import { IProjectCard } from '../IProjectCard';
import { IActionCard, IResourceCard } from '../ICard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { ResourceType } from '../../ResourceType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Resources } from '../../Resources';
import { Game } from '../../Game';
import { LogHelper } from '../../components/LogHelper';

export class AsteroidHollowing implements IActionCard, IProjectCard, IResourceCard {
    public name: CardName = CardName.ASTEROID_HOLLOWING;
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.SPACE];
    public resourceType: ResourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;
    public cardType: CardType = CardType.ACTIVE;

    public play() {
        return undefined;
    }

    public canAct(player: Player): boolean {
        return player.titanium > 0;
    }

    public action(player: Player, game: Game) {
        player.titanium -= 1;
        player.setProduction(Resources.MEGACREDITS);
        player.addResourceTo(this);
        LogHelper.logAddResource(game, player, this);

        return undefined;
    }

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 2);
    }

}