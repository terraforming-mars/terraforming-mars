import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {GainResources} from '../../deferredActions/GainResources';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';

export class SagittaFrontierServices extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.SAGITTA_FRONTIER_SERVICES,
      startingMegaCredits: 31,

      behavior: {
        production: {energy: 1, megacredits: 2},
      },

      metadata: {
        cardNumber: 'PC03', // Renumber
        hasExternalHelp: true,
        renderData: CardRenderer.builder((b) => {
          // TODO(kberg): provide reasonable secondary tag. It's not rendered on CardRenderItemComponent.
          b.megacredits(31).production((pb) => pb.energy(1).megacredits(2)).cards(1, {secondaryTag: AltSecondaryTag.NO_TAGS}).br;
          b.effect('When you play a card with no tags, including this, gain 4 M€.', (eb) => eb.noTags().startEffect.megacredits(4)).br;
          b.effect('When you play a card with EXACTLY 1 TAG, you gain 1 M€.', (eb) => eb.emptyTag().asterix().startEffect.megacredits(1)).br;
        }),
        description: 'You start with 31 M€. Increase energy production 1 step and M€ production 2 steps. Draw a card that has no tag.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    // Gain the 4 MC for playing itself.
    player.stock.megacredits += 4;
    player.game.log('${0} gained 4 M€ for playing a card with no tags.', (b) => b.player(player));

    player.drawCard(1, {include: (c) => c.tags.length === 0 && c.type !== CardType.EVENT});
    return undefined;
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard, cardOwner: IPlayer) {
    if (player === cardOwner) {
      this.onCardPlayed(cardOwner, card);
    }
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (player.isCorporation(this.name)) {
      const count = card.tags.filter((tag) => tag !== Tag.WILD).length + (card.type === CardType.EVENT ? 1 : 0);
      if (count === 0) {
        player.game.defer(new GainResources(player, Resource.MEGACREDITS, {count: 4}))
          .andThen(() => {
            player.game.log('${0} gained 4 M€ for playing ${1}, which has no tags.', (b) => b.player(player).card(card));
          });
      }
      if (count === 1) {
        player.game.defer(new GainResources(player, Resource.MEGACREDITS, {count: 1}))
          .andThen(() => {
            player.game.log('${0} gained 1 M€ for playing ${1}, which has exactly 1 tag.', (b) => b.player(player).card(card));
          });
      }
    }
  }
}
