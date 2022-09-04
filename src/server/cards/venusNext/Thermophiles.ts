import {IActionCard} from '../ICard';
import {PlayerInput} from '../../PlayerInput';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_VENUS_SCALE} from '../../../common/constants';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class Thermophiles extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.THERMOPHILES,
      cardType: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.MICROBE],
      cost: 9,
      resourceType: CardResource.MICROBE,

      requirements: CardRequirements.builder((b) => b.venus(6)),
      metadata: {
        cardNumber: '253',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to ANY Venus CARD.', (eb) => {
            eb.empty().startAction.microbes(1, {secondaryTag: Tag.VENUS});
          }).br;
          b.or().br;
          b.action('Spend 2 Microbes here to raise Venus 1 step.', (eb) => {
            eb.microbes(2).startAction.venus(1);
          });
        }),
        description: 'Requires Venus 6%',
      },
    });
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const venusMicrobeCards = player.getResourceCards(CardResource.MICROBE).filter((card) => card.tags.includes(Tag.VENUS));
    const canRaiseVenus = this.resourceCount > 1 && player.game.getVenusScaleLevel() < MAX_VENUS_SCALE;

    // only 1 valid target and cannot remove 2 microbes - add to itself
    if (venusMicrobeCards.length === 1 && !canRaiseVenus) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    const opts: Array<PlayerInput> = [];

    const spendResource = new SelectOption('Remove 2 microbes to raise Venus 1 step', 'Remove microbes', () => {
      player.removeResourceFrom(this, 2);
      player.game.increaseVenusScaleLevel(player, 1);
      return undefined;
    });

    const addResource = new SelectCard(
      'Select a Venus card to add 1 microbe',
      'Add microbe',
      venusMicrobeCards,
      ([card]) => {
        player.addResourceTo(card, {log: true});
        return undefined;
      },
    );

    const addResourceToSelf = new SelectOption('Add a microbe to this card', 'Add microbe', () => {
      player.addResourceTo(venusMicrobeCards[0], {log: true});
      return undefined;
    });

    if (canRaiseVenus) {
      if (player.canAfford(0, {tr: {venus: 1}})) {
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
