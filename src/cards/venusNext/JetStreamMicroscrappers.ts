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
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class JetStreamMicroscrappers implements IActionCard, IProjectCard, IResourceCard {
    public cost = 12;
    public tags = [Tags.VENUS];
    public name = CardName.JET_STREAM_MICROSCRAPPERS;
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
        return player.titanium > 0 || (canSpendResource && player.canAfford(REDS_RULING_POLICY_COST));
      }

      return player.titanium > 0 || canSpendResource;
    }

    public action(player: Player, game: Game) {
      const opts: Array<SelectOption> = [];

      const addResource = new SelectOption('Spend one titanium to add 2 floaters to this card', 'Spend titanium', () => this.addResource(player));
      const spendResource = new SelectOption('Remove 2 floaters to raise Venus 1 step', 'Remove floaters', () => this.spendResource(player, game));

      if (this.resourceCount > 1 && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
        opts.push(spendResource);
      } else {
        return this.addResource(player);
      }

      if (player.titanium > 0) {
        opts.push(addResource);
      } else {
        return this.spendResource(player, game);
      }

      return new OrOptions(...opts);
    }

    private addResource(player: Player) {
      player.addResourceTo(this, 2);
      LogHelper.logAddResource(player, this, 2);
      player.titanium--;
      return undefined;
    }

    private spendResource(player: Player, game: Game) {
      this.resourceCount -= 2;
      game.increaseVenusScaleLevel(player, 1);
      LogHelper.logVenusIncrease( player, 1);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '234',
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 1 titanium to add 2 Floaters here', (eb) => {
          eb.titanium(1).startAction.floaters(2);
        }).br;
        b.or().br;
        b.action('Spend 2 Floaters here to raise Venus 1 step', (eb) => {
          eb.floaters(2).startAction.venus(1);
        });
      }),
    };
}
