import {CardType} from '../../common/cards/CardType';
import {IPlayer} from '../IPlayer';
import {IActionCard, ICard} from './ICard';
import {TRSource} from '../../common/cards/TRSource';
import {PlayerInput} from '../PlayerInput';
import {ICardMetadata} from '../../common/cards/ICardMetadata';
import {CardName} from '../../common/cards/CardName';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {Card} from './Card';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Units} from '../../common/Units';

type StaticStandardProjectCardProperties = {
  name: CardName,
  cost: number,
  metadata: ICardMetadata,
  reserveUnits?: Partial<Units>,
  tr?: TRSource,
}

export type StandardProjectCanPayWith = {
  steel?: boolean,
  titanium?: boolean,
  seeds?: boolean,
  kuiperAsteroids?: boolean,
  // tr?: TRSource,
}

export abstract class StandardProjectCard extends Card implements IActionCard, ICard {
  constructor(properties: StaticStandardProjectCardProperties) {
    super({
      type: CardType.STANDARD_PROJECT,
      ...properties,
    });
  }

  public override get type(): CardType.STANDARD_PROJECT {
    return CardType.STANDARD_PROJECT;
  }

  protected discount(_player: IPlayer) {
    return 0;
  }

  protected abstract actionEssence(player: IPlayer): void

  public onStandardProject(player: IPlayer): void {
    for (const playedCard of player.tableau) {
      playedCard.onStandardProject?.(player, this);
    }
  }

  protected canPlayOptions(player: IPlayer) {
    const canPayWith = this.canPayWith(player);
    return {
      ...canPayWith,
      cost: this.cost - this.discount(player),
      tr: this.tr,
      auroraiData: true,
      reserveUnits: MoonExpansion.adjustedReserveCosts(player, this),
    };
  }

  public canAct(player: IPlayer): boolean {
    return player.canAfford(this.canPlayOptions(player));
  }

  public canPayWith(_player: IPlayer): StandardProjectCanPayWith {
    return {};
  }

  protected projectPlayed(player: IPlayer) {
    player.game.log('${0} used ${1} standard project', (b) => b.player(player).card(this));
    this.onStandardProject(player);
  }

  private suffixFreeCardName(cardName: CardName): string {
    return cardName.split(':')[0];
  }

  public action(player: IPlayer): PlayerInput | undefined {
    const canPayWith = this.canPayWith(player);
    player.game.defer(new SelectPaymentDeferred(
      player,
      this.cost - this.discount(player),
      {
        canUseSteel: canPayWith.steel,
        canUseTitanium: canPayWith.titanium,
        canUseSeeds: canPayWith.seeds,
        canUseData: player.isCorporation(CardName.AURORAI),
        canUseAsteroids: player.isCorporation(CardName.KUIPER_COOPERATIVE),
        title: `Select how to pay for ${this.suffixFreeCardName(this.name)} standard project`,
        afterPay: () => {
          this.projectPlayed(player);
          this.actionEssence(player);
        },
      }));
    return undefined;
  }
}
