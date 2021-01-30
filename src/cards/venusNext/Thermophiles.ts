import {IActionCard, ICard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';
import {Card} from '../Card';

export class Thermophiles extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.THERMOPHILES,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.MICROBE],
      cost: 9,
      resourceType: ResourceType.MICROBE,

      metadata: {
        cardNumber: '253',
        requirements: CardRequirements.builder((b) => b.venus(6)),
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to ANY Venus CARD.', (eb) => {
            eb.empty().startAction.microbes(1).secondaryTag(Tags.VENUS);
          }).br;
          b.or().br;
          b.action('Spend 2 Microbes here to raise Venus 1 step.', (eb) => {
            eb.microbes(2).startAction.venus(1);
          });
        }),
        description: 'Requires Venus 6%',
      },
    });
  };
  public resourceCount: number = 0;
  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.VENUS, 6);
  }
  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const venusMicrobeCards = player.getResourceCards(ResourceType.MICROBE).filter((card) => card.tags.indexOf(Tags.VENUS) !== -1);
    const canRaiseVenus = this.resourceCount > 1 && player.game.getVenusScaleLevel() < MAX_VENUS_SCALE;

    // only 1 valid target and cannot remove 2 microbes - add to itself
    if (venusMicrobeCards.length === 1 && !canRaiseVenus) {
      player.addResourceTo(this);
      LogHelper.logAddResource(player, this);
      return undefined;
    }

    const opts: Array<SelectOption | SelectCard<ICard>> = [];

    const spendResource = new SelectOption('Remove 2 microbes to raise Venus 1 step', 'Remove microbes', () => {
      player.removeResourceFrom(this, 2);
      player.game.increaseVenusScaleLevel(player, 1);
      return undefined;
    });

    const addResource = new SelectCard(
      'Select a Venus card to add 1 microbe',
      'Add microbe',
      venusMicrobeCards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], 1);
        LogHelper.logAddResource(player, foundCards[0]);
        return undefined;
      },
    );

    const addResourceToSelf = new SelectOption('Add a microbe to this card', 'Add microbe', () => {
      player.addResourceTo(venusMicrobeCards[0], 1);
      LogHelper.logAddResource(player, this);
      return undefined;
    });

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS);

    if (canRaiseVenus) {
      if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
        opts.push(spendResource);
      }
    } else {
      if (venusMicrobeCards.length === 1) return addResourceToSelf;
      return addResource;
    }

    venusMicrobeCards.length === 1 ? opts.push(addResourceToSelf) : opts.push(addResource);

    return new OrOptions(...opts);
  }
}
