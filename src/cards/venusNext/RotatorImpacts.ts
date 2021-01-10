import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Game} from '../../Game';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class RotatorImpacts implements IActionCard, IProjectCard, IResourceCard {
    public cost = 6;
    public tags = [Tags.SPACE];
    public name = CardName.ROTATOR_IMPACTS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      return game.checkMaxRequirements(player, GlobalParameter.VENUS, 14);
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
      const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
      const canSpendResource = this.resourceCount > 0 && !venusMaxed;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
        return player.canAfford(6, game, false, true) || (canSpendResource && player.canAfford(REDS_RULING_POLICY_COST));
      }

      return player.canAfford(6, game, false, true) || canSpendResource;
    }

    public action(player: Player, game: Game) {
      const opts: Array<SelectOption> = [];

      const addResource = new SelectOption('Pay 6 to add 1 asteroid to this card', 'Pay', () => this.addResource(player, game));
      const spendResource = new SelectOption('Remove 1 asteroid to raise Venus 1 step', 'Remove asteroid', () => this.spendResource(player, game));

      if (this.resourceCount > 0 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
        opts.push(spendResource);
      } else {
        return this.addResource(player, game);
      }

      if (player.canAfford(6, game, false, true)) {
        opts.push(addResource);
      } else {
        return this.spendResource(player, game);
      }

      return new OrOptions(...opts);
    }

    private addResource(player: Player, game: Game) {
      game.defer(new SelectHowToPayDeferred(player, 6, {canUseTitanium: true, title: 'Select how to pay for action'}));
      player.addResourceTo(this);
      LogHelper.logAddResource(player, this);
      return undefined;
    }

    private spendResource(player: Player, game: Game) {
      player.removeResourceFrom(this);
      game.increaseVenusScaleLevel(player, 1);
      game.log('${0} removed an asteroid resource to increase Venus scale 1 step', (b) => b.player(player));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '243',
      requirements: CardRequirements.builder((b) => b.venus(14).max()),
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 6 MC to add an asteroid resource to this card [TITANIUM MAY BE USED].', (eb) => {
          eb.megacredits(6).titanium(1).brackets.startAction.asteroids(1);
        }).br;
        b.action('Spend 1 resource from this card to increase Venus 1 step.', (eb) => {
          eb.or().asteroids(1).startAction.venus(1);
        });
      }),
      description: 'Venus must be 14% or lower',
    }
}
