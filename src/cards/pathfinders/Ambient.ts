import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {digit, played} from '../Options';
import {IProjectCard} from '../IProjectCard';
import {ICard} from '../ICard';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {MAX_TEMPERATURE} from '../../common/constants';
import {Size} from '../../common/cards/render/Size';

export class Ambient extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.AMBIENT,
      tags: [Tags.VENUS],
      startingMegaCredits: 38,

      initialActionText: 'Raise the Venus scale 2 steps.',

      metadata: {
        cardNumber: 'PfC3',
        description: 'You start with 38 M€. As your first action, raise the Venus scale 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).venus(2, {size: Size.SMALL}).br;
          b.effect('When you play a card with a Venus tag (including this) increase your heat production 1 step.', (eb) => {
            eb.venus(1, {played}).startEffect.production((pb) => pb.heat(1));
          }).br;
          b.action('When temperature is maxed, spend 8 heat gain 1 TR. ' +
            'You may repeat this action like a standard project.', (ab) => {
            ab.heat(8, {digit, size: Size.SMALL}).startAction.tr(1, {size: Size.SMALL}).text('∞');
          });
        }),
      },
    });
  }

  public play(player: Player) {
    this.onCorpCardPlayed(player, this);
    return undefined;
  }

  public initialAction(player: Player) {
    player.game.increaseVenusScaleLevel(player, 2);
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: ICorporationCard) {
    return this.onCardPlayed(player, card as ICard as IProjectCard);
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (player.isCorporation(this.name) && card.tags.includes(Tags.VENUS)) {
      player.addProduction(Resources.HEAT, 1, {log: true});
    }
  }

  public canAct(player: Player) {
    return player.heat >= 8 && player.game.getTemperature() === MAX_TEMPERATURE && player.canAfford(0, {tr: {tr: 1}});
  }

  public action(player: Player) {
    player.heat -= 8;
    player.increaseTerraformRating();
    // A hack that allows this action to be replayable.
    player.game.defer(new SimpleDeferredAction(player, () => {
      player.getActionsThisGeneration().delete(this.name);
      return undefined;
    }));
    return undefined;
  }
}
