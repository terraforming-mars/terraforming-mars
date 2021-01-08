import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {IResourceCard} from '../ICard';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TitanAirScrapping implements IProjectCard, IResourceCard {
    public cost = 21;
    public tags = [Tags.JOVIAN];
    public name = CardName.TITAN_AIRSCRAPPING;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(player: Player, game: Game): boolean {
      const hasTitanium = player.titanium > 0;
      const hasResources = this.resourceCount >= 2;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return hasTitanium || (player.canAfford(REDS_RULING_POLICY_COST) && hasResources);
      }

      return hasTitanium || hasResources;
    }

    public action(player: Player, game: Game) {
      const opts: Array<SelectOption> = [];

      const addResource = new SelectOption('Spend 1 titanium to add 2 floaters on this card', 'Spend titanium', () => this.addResource(player));
      const spendResource = new SelectOption('Remove 2 floaters on this card to increase your TR 1 step', 'Remove floaters', () => this.spendResource(player, game));

      if (this.resourceCount >= 2 && player.titanium > 0) {
        const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);
        if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
          opts.push(spendResource);
        }
        opts.push(addResource);
      } else if (player.titanium > 0) {
        return this.addResource(player);
      } else {
        return this.spendResource(player, game);
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

    public metadata: CardMetadata = {
      cardNumber: 'C43',
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 1 titanium to add 2 floaters here.', (eb) => {
          eb.titanium(1).startAction.floaters(2);
        }).br;
        b.or().br;
        b.action('Spend 2 floaters here to increase your TR 1 step.', (eb) => {
          eb.floaters(2).startAction.tr(1);
        });
      }),
      victoryPoints: 2,
    }
}
