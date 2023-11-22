import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';
import {LogHelper} from '../../LogHelper';

export class TheArchaicFoundationInstitute extends CorporationCard {
  constructor() {
    super({
      name: CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE,
      tags: [Tag.MOON, Tag.MOON],
      startingMegaCredits: 55,
      resourceType: CardResource.RESOURCE_CUBE,

      behavior: {
        addResources: 2,
      },

      metadata: {
        description: 'You start with 55 M€.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(55).nbsp;
          b.effect('When you play a Moon tag, including these, add a cube to this card.', (eb) => {
            eb.moon().startEffect.resourceCube();
          }).br;
          b.effect('Automatically remove 3 cubes here and gain 1 TR.', (eb) => {
            eb.resourceCube(3, {digit}).startEffect.tr(1, {size: Size.TINY});
          }).br;
          b.action('Remove 3 cubes here; gain 1 TR.', (ab) => {
            ab.resourceCube(3, {digit}).startAction.tr(1, {size: Size.TINY});
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard): void {
    if (player.isCorporation(this.name)) {
      const moonTags = card.tags.filter((t) => t === Tag.MOON);
      const count = moonTags.length;
      if (count > 0) {
        player.addResourceTo(this, {qty: count, log: true});
      }
    }
  }

  public canAct(player: IPlayer) {
    return (this.resourceCount >= 3 && player.canAfford({cost: 0, tr: {tr: 1}}));
  }

  // The only reason Archaic Foundation Institute has an action is if Reds is
  // in effect when the player gains the Moon tag. Ideally, this is always
  // automatically resolved, even at strange times, even produciton.
  //
  public action(player: IPlayer) {
    // How should this interact in a Merger with UNMO?
    let tr = Math.floor(this.resourceCount / 3);
    while (!player.canAfford({cost: 0, tr: {tr: tr}})) {
      tr--;
    }
    player.removeResourceFrom(this, tr * 3);
    player.increaseTerraformRating(tr);
    LogHelper.logRemoveResource(player, this, tr * 3, `Gain ${tr} TR`);
  }

  public onResourceAdded(player: IPlayer, playedCard: ICard): void {
    if (playedCard.name !== this.name) return;
    if (this.canAct(player)) {
      this.action(player);
    }
  }
}
