import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Game} from '../../Game';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../CardName';

export class SulphurEatingBacteria implements IActionCard, IProjectCard, IResourceCard {
    public cost = 6;
    public tags = [Tags.VENUS, Tags.MICROBES];
    public name = CardName.SULPHUR_EATING_BACTERIA;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      return game.getVenusScaleLevel() >= 6 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      const opts: Array<SelectOption | SelectAmount> = [];

      const addResource = new SelectOption('Add 1 microbe to this card', 'Add microbe', () => this.addResource(player));
      const spendResource = new SelectAmount('Remove any number of microbes to gain 3 MC per microbe removed', 'Remove microbes', (amount: number) => this.spendResource(player, amount), this.resourceCount);

      if (this.resourceCount > 0) {
        opts.push(spendResource);
      } else {
        return this.addResource(player);
      }

      opts.push(addResource);

      return new OrOptions(...opts);
    }

    private addResource(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }

    private spendResource(player: Player, amount: number) {
      player.removeResourceFrom(this, amount);
      player.megaCredits += 3 * amount;
      return undefined;
    }
}
