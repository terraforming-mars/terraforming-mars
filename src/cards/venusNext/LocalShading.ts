import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class LocalShading implements IActionCard, IProjectCard, IResourceCard {
    public cost = 4;
    public tags = [Tags.VENUS];
    public name = CardName.LOCAL_SHADING;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      if (this.resourceCount < 1) {
        this.resourceCount++;
        return undefined;
      }

      const opts: Array<SelectOption> = [];

      const addResource = new SelectOption('Add 1 floater to this card', 'Add floater', () => this.addResource());
      const spendResource = new SelectOption('Remove 1 floater to increase MC production 1 step', 'Remove floater', () => this.spendResource(player));

      opts.push(spendResource);
      opts.push(addResource);

      return new OrOptions(...opts);
    }

    private addResource() {
      this.resourceCount++;
      return undefined;
    }

    private spendResource(player: Player) {
      player.removeResourceFrom(this);
      player.addProduction(Resources.MEGACREDITS);
      return undefined;
    }
}
