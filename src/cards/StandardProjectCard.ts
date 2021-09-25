import {CardType} from './CardType';
import {Player} from '../Player';
import {IActionCard, ICard} from './ICard';
import {OrOptions} from '../inputs/OrOptions';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectOption} from '../inputs/SelectOption';
import {IProjectCard} from './IProjectCard';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {AndOptions} from '../inputs/AndOptions';
import {SelectCard} from '../inputs/SelectCard';
import {SelectSpace} from '../inputs/SelectSpace';
import {ICardMetadata} from './ICardMetadata';
import {CardName} from '../CardName';
import {SelectHowToPayDeferred} from '../deferredActions/SelectHowToPayDeferred';
import {Card} from './Card';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Units} from '../Units';

interface StaticStandardProjectCardProperties {
  name: CardName,
  cost: number,
  metadata: ICardMetadata,
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

  private suffixFreeCardName(cardName: CardName): string {
    return cardName.split(':')[0];
  };

  public action(player: Player): OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined {
    player.game.defer(new SelectHowToPayDeferred(
      player,
      this.cost - this.discount(player),
      {
        title: `Select how to pay for ${this.suffixFreeCardName(this.name)} standard project`,
        afterPay: () => {
          this.projectPlayed(player);
          this.actionEssence(player);
        },
      }));
    return undefined;
  }
}
