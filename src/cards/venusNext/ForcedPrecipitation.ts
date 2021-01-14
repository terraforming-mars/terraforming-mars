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
import {CardRenderer} from '../render/CardRenderer';

export class ForcedPrecipitation implements IActionCard, IProjectCard, IResourceCard {
    public cost = 8;
    public tags = [Tags.VENUS];
    public name = CardName.FORCED_PRECIPITATION;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public play() {
      return undefined;
    }

    public canAct(player: Player, game: Game): boolean {
      const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
      const canSpendResource = this.resourceCount > 1 && !venusMaxed;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
        return player.canAfford(2) || (canSpendResource && player.canAfford(REDS_RULING_POLICY_COST));
      }

      return player.canAfford(2) || canSpendResource;
    }

    public action(player: Player, game: Game) {
      const opts: Array<SelectOption> = [];

      const addResource = new SelectOption('Pay 2 to add 1 floater to this card', 'Pay', () => this.addResource(player, game));
      const spendResource = new SelectOption('Remove 2 floaters to raise Venus 1 step', 'Remove floaters', () => this.spendResource(player, game));
      const canAffordRed = !PartyHooks.shouldApplyPolicy(game, PartyName.REDS) || player.canAfford(REDS_RULING_POLICY_COST);
      if (this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE && canAffordRed) {
        opts.push(spendResource);
      } else {
        return this.addResource(player, game);
      };

      if (player.canAfford(2)) {
        opts.push(addResource);
      } else {
        return this.spendResource(player, game);
      }

      return new OrOptions(...opts);
    }

    private addResource(player: Player, game: Game) {
      game.defer(new SelectHowToPayDeferred(player, 2, {title: 'Select how to pay for action'}));
      player.addResourceTo(this);
      LogHelper.logAddResource(player, this);
      return undefined;
    }

    private spendResource(player: Player, game: Game) {
      player.removeResourceFrom(this, 2);
      game.increaseVenusScaleLevel(player, 1);
      LogHelper.logVenusIncrease( player, 1);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '226',
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 2 MC to add 1 Floater to THIS card.', (eb) => {
          eb.megacredits(2).startAction.floaters(1).asterix;
        }).br;
        b.or().br;
        b.action('Spend 2 Floaters here to increase Venus 1 step.', (eb) => {
          eb.floaters(2).startAction.venus(1);
        });
      }),
    }
}
