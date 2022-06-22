import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';
import {MAX_OXYGEN_LEVEL, MAX_VENUS_SCALE} from '../../common/constants';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class RobinHaulings extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ROBIN_HAULINGS,
      tags: [Tags.MARS, Tags.VENUS],
      startingMegaCredits: 39,
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: 'PfC9',
        description: 'You start with 39 M€',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(39).br;
          b.effect('Whenever you play a card with a Venus tag add 1 floater to any card.', (eb) => {
            eb.venus(1, {played}).startEffect.floaters(1).asterix();
          });
          b.br;
          b.action('Remove 3 floaters from this card to raise Venus 1 step or raise oxygen 1 step', (ab) => {
            ab.floaters(3, {digit: true}).startAction.venus(1).or().oxygen(1);
          });
        }),
      },
    });
  }

  public override resourceCount = 0;

  public play(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (player.isCorporation(CardName.ROBIN_HAULINGS) && card.tags.includes(Tags.VENUS)) {
      player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER));
    }
  }

  private canRaiseVenus(player: Player) {
    return player.game.getVenusScaleLevel() < MAX_VENUS_SCALE && player.canAfford(0, {tr: {venus: 1}});
  }

  private canRaiseOxygen(player: Player) {
    return player.game.getOxygenLevel() < MAX_OXYGEN_LEVEL && player.canAfford(0, {tr: {oxygen: 1}});
  }

  public canAct(player: Player) {
    if (this.resourceCount < 3) return false;
    return this.canRaiseVenus(player) || this.canRaiseOxygen(player);
  }

  public action(player: Player) {
    const options = new OrOptions();
    if (this.canRaiseVenus(player)) {
      options.options.push(
        new SelectOption(
          'Spend 3 floaters to raise Venus 1 step',
          'OK',
          () => {
            player.game.increaseVenusScaleLevel(player, 1);
            this.resourceCount -= 3;
            return undefined;
          }));
    }
    if (this.canRaiseOxygen(player)) {
      options.options.push(
        new SelectOption(
          'Spend 3 floaters to raise oxygen 1 step',
          'OK',
          () => {
            player.game.increaseOxygenLevel(player, 1);
            this.resourceCount -= 3;
            return undefined;
          }));
    }

    if (options.options.length === 0) {
      return undefined;
    }
    if (options.options.length === 1) {
      return options.options[0];
    }
    return options;
  }
}
