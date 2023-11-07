import {CardType} from '../../common/cards/CardType';
import {IPlayer} from '../IPlayer';
import {TRSource} from '../../common/cards/TRSource';
import {PlayerInput} from '../PlayerInput';
import {ICardMetadata} from '../../common/cards/ICardMetadata';
import {CardName} from '../../common/cards/CardName';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {Card} from './Card';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Units} from '../../common/Units';
import {message} from '../logs/MessageBuilder';
import {IStandardProjectCard} from './IStandardProjectCard';

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

export abstract class StandardProjectCard extends Card implements IStandardProjectCard {
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

  private _discount(player: IPlayer) {
    const underworldStandardProjectCard = player.playedCards.find(
      (card) => card.name === CardName.STANDARD_TECHNOLOGY_UNDERWORLD,
    );
    const underworldDiscount = underworldStandardProjectCard?.getCardDiscount?.(player, this) ?? 0;
    return underworldDiscount + this.discount(player);
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
      cost: this.cost - this._discount(player),
      tr: this.tr,
      auroraiData: true,
      spireScience: true,
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

  public action(player: IPlayer): PlayerInput | undefined {
    const canPayWith = this.canPayWith(player);
    player.game.defer(new SelectPaymentDeferred(
      player,
      this.cost - this._discount(player),
      {
        canUseSteel: canPayWith.steel,
        canUseTitanium: canPayWith.titanium,
        canUseSeeds: canPayWith.seeds,
        canUseAuroraiData: player.isCorporation(CardName.AURORAI),
        canUseSpireScience: player.isCorporation(CardName.SPIRE),
        canUseAsteroids: canPayWith.kuiperAsteroids && player.isCorporation(CardName.KUIPER_COOPERATIVE),
        title: message('Select how to pay for the ${0} standard project', (b) => b.cardName(this.name)),
      })).andThen(() => {
      this.projectPlayed(player);
      this.actionEssence(player);
    });
    return undefined;
  }
}
