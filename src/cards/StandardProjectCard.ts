import {CardType} from './CardType';
import {Player} from '../Player';
import {IActionCard, ICard} from './ICard';
import {CardMetadata} from './CardMetadata';
import {CardName} from '../CardName';
import {SelectHowToPayDeferred} from '../deferredActions/SelectHowToPayDeferred';
import {Card} from './Card';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Units} from '../Units';
import {PlayerInputs} from '../inputs/PlayerInputs';

interface StaticStandardProjectCardProperties {
  name: CardName,
  cost: number,
  metadata: CardMetadata,
  reserveUnits?: Units,
}

export abstract class StandardProjectCard extends Card implements IActionCard, ICard {
  constructor(properties: StaticStandardProjectCardProperties) {
    super({
      cardType: CardType.STANDARD_PROJECT,
      ...properties,
    });
  }

  protected discount(_player: Player) {
    return 0;
  }

  public play() {
    return undefined;
  }

  protected abstract actionEssence(player: Player): void

  public onStandardProject(player: Player): void {
    if (player.corporationCard?.onStandardProject !== undefined) {
      player.corporationCard.onStandardProject(player, this);
    }

    for (const playedCard of player.playedCards) {
      if (playedCard.onStandardProject !== undefined) {
        playedCard.onStandardProject(player, this);
      }
    }
  }

  public canAct(player: Player): boolean {
    return player.canAfford(this.cost - this.discount(player), {reserveUnits: MoonExpansion.adjustedReserveCosts(player, this)});
  }

  protected projectPlayed(player: Player) {
    player.game.log('${0} used ${1} standard project', (b) => b.player(player).card(this));
    this.onStandardProject(player);
  }

  public action(player: Player): PlayerInputs | undefined {
    player.game.defer(new SelectHowToPayDeferred(
      player,
      this.cost - this.discount(player),
      {
        title: `Select how to pay for ${this.name} project`,
        afterPay: () => {
          this.actionEssence(player);
        },
      }));
    this.projectPlayed(player);
    return undefined;
  }
}
