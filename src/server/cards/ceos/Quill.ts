import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Resources} from '../../../common/Resources';
import {GainResources} from '../../deferredActions/GainResources';


export class Quill extends CeoCard {
  constructor() {
    super({
      name: CardName.QUILL,
      metadata: {
        cardNumber: 'L17',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY').br;
          b.cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).colon().floaters(2).megacredits(1).asterix();
        }),
        description: 'Once per game, add 2 floaters to each of your cards that collect floaters, then add 2 floaters to ANY card. Gain 1 M€ for every 2 floaters added this way.',
      },
    });
  }

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.getResourceCards(CardResource.FLOATER).length > 0;
  }

  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    const resourceCards = player.getResourceCards(CardResource.FLOATER);
    resourceCards.forEach((card) => player.addResourceTo(card, {qty: 2, log: true}));
    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2}));
    player.game.defer(new GainResources(player, Resources.MEGACREDITS, {count: resourceCards.length + 1, log: true}));
    return undefined;
  }
}
