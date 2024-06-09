import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {digit} from '../Options';
import {IProjectCard} from '../IProjectCard';
import {MAX_OXYGEN_LEVEL, MAX_VENUS_SCALE} from '../../../common/constants';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class RobinHaulings extends CorporationCard {
  constructor() {
    super({
      name: CardName.ROBIN_HAULINGS,
      tags: [Tag.MARS, Tag.VENUS],
      startingMegaCredits: 39,
      resourceType: CardResource.FLOATER,

      behavior: {
        addResources: 1,
      },

      metadata: {
        cardNumber: 'PfC9',
        description: 'You start with 39 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(39).br;
          b.effect('Whenever you play a card with a Venus tag add 1 floater to ANY card.', (eb) => {
            eb.tag(Tag.VENUS).startEffect.resource(CardResource.FLOATER).asterix();
          });
          b.br;
          b.action('Remove 3 floaters from this card to raise Venus 1 step or raise oxygen 1 step', (ab) => {
            ab.resource(CardResource.FLOATER, {amount: 3, digit}).startAction.venus(1).or().oxygen(1);
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (player.isCorporation(CardName.ROBIN_HAULINGS) && card.tags.includes(Tag.VENUS)) {
      player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER));
    }
  }

  private canRaiseVenus(player: IPlayer) {
    return player.game.getVenusScaleLevel() < MAX_VENUS_SCALE && player.canAfford({cost: 0, tr: {venus: 1}});
  }

  private canRaiseOxygen(player: IPlayer) {
    return player.game.getOxygenLevel() < MAX_OXYGEN_LEVEL && player.canAfford({cost: 0, tr: {oxygen: 1}});
  }

  public canAct(player: IPlayer) {
    if (this.resourceCount < 3) return false;
    return this.canRaiseVenus(player) || this.canRaiseOxygen(player);
  }

  public action(player: IPlayer) {
    const options = new OrOptions();
    if (this.canRaiseVenus(player)) {
      options.options.push(
        new SelectOption('Spend 3 floaters to raise Venus 1 step')
          .andThen(() => {
            player.game.increaseVenusScaleLevel(player, 1);
            this.resourceCount -= 3;
            return undefined;
          }));
    }
    if (this.canRaiseOxygen(player)) {
      options.options.push(
        new SelectOption('Spend 3 floaters to raise oxygen 1 step')
          .andThen(() => {
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
