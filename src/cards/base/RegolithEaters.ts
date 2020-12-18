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
import {LogHelper} from '../../components/LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class RegolithEaters implements IActionCard, IProjectCard, IResourceCard {
    public cost = 13;
    public tags = [Tags.SCIENCE, Tags.MICROBES];
    public name = CardName.REGOLITH_EATERS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;

    public play(_player: Player, _game: Game) {
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
        orOptions.options.push(new SelectOption('Remove 2 microbes to raise oxygen level 1 step', 'Remove microbes', () => {
          player.removeResourceFrom(this, 2);
          LogHelper.logRemoveResource(game, player, this, 2, 'raise oxygen 1 step');
          return game.increaseOxygenLevel(player, 1);
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
      cardNumber: '033',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.microbes(1);
          eb.description('Action: Add 1 Microbe to this card.');
        }).br;
        b.or().br;
        b.effectBox((eb) => {
          eb.microbes(2).startAction.oxygen(1);
          eb.description('Action: Remove 2 Microbes from this card to raise oxygen level 1 step.');
        }).br;
      }),
    }
}
