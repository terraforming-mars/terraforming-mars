import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';
import {REDS_RULING_POLICY_COST} from '../../constants';

export class GHGProducingBacteria implements IActionCard, IProjectCard, IResourceCard {
    public cost = 8;
    public tags = [Tags.SCIENCE, Tags.MICROBE];
    public name = CardName.GHG_PRODUCING_BACTERIA;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.OXYGEN, 4);
    }
    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player, game: Game) {
      if (this.resourceCount < 2) {
        player.addResourceTo(this);
        LogHelper.logAddResource(game, player, this);
        return undefined;
      }

      const orOptions = new OrOptions();
      const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);

      if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
        orOptions.options.push(new SelectOption('Remove 2 microbes to raise temperature 1 step', 'Remove microbes', () => {
          player.removeResourceFrom(this, 2);
          LogHelper.logRemoveResource(game, player, this, 2, 'raise temperature 1 step');
          return game.increaseTemperature(player, 1);
        }));
      }

      orOptions.options.push(new SelectOption('Add 1 microbe to this card', 'Add microbe', () => {
        player.addResourceTo(this);
        LogHelper.logAddResource(game, player, this);
        return undefined;
      }));

      if (orOptions.options.length === 1) return orOptions.options[0].cb();
      return orOptions;
    }
    public metadata: CardMetadata = {
      description: 'Requires 4% oxygen.',
      cardNumber: '034',
      requirements: CardRequirements.builder((b) => b.oxygen(4)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.microbes(1);
          eb.description('Action: Add 1 Microbe to this card.');
        }).br;
        b.or().br;
        b.effectBox((eb) => {
          eb.microbes(2).startAction.temperature(1);
          eb.description('Action: Remove 2 Microbes to raise temperature 1 step.');
        });
      }),
    };
}
