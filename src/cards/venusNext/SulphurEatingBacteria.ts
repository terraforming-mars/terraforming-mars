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
import {LogHelper} from '../../components/LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

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
    public action(player: Player, game: Game) {
      const opts: Array<SelectOption | SelectAmount> = [];

      const addResource = new SelectOption('Add 1 microbe to this card', 'Add microbe', () => this.addResource(player, game));
      const spendResource = new SelectAmount('Remove any number of microbes to gain 3 MC per microbe removed', 'Remove microbes', (amount: number) => this.spendResource(player, game, amount), 1, this.resourceCount);

      if (this.resourceCount > 0) {
        opts.push(spendResource);
      } else {
        return this.addResource(player, game);
      }

      opts.push(addResource);

      return new OrOptions(...opts);
    }

    private addResource(player: Player, game: Game) {
      player.addResourceTo(this);
      LogHelper.logAddResource(game, player, this);
      return undefined;
    }

    private spendResource(player: Player, game: Game, amount: number) {
      player.removeResourceFrom(this, amount);

      const megaCreditsGained = 3 * amount;
      player.megaCredits += megaCreditsGained;

      const logText: string = 'gain ' + megaCreditsGained + ' MC';
      LogHelper.logRemoveResource(game, player, this, amount, logText);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '251',
      requirements: CardRequirements.builder((b) => b.venus(6)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.microbes(1);
          eb.description('Action: Add 1 Microbe to this card.');
        }).br;
        b.or().br;
        b.effectBox((eb) => {
          eb.text('x').microbes(1).startAction.megacredits(3).multiplier;
          eb.description('Action: Spend any number of Microbes here to gain triple amount of MC.');
        });
      }),
      description: 'Requires Venus 6%',
    };
}
