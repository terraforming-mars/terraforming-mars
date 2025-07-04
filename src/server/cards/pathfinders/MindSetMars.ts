import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {Turmoil} from '../../turmoil/Turmoil';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {Size} from '../../../common/cards/render/Size';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class MindSetMars extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.MIND_SET_MARS,
      startingMegaCredits: 44,
      resourceType: CardResource.AGENDA,

      behavior: {
        addResources: 1,
      },

      metadata: {
        cardNumber: 'PfC21',
        description: 'You start with 44 M€ and 1 agenda resource to this card.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(44).resource(CardResource.AGENDA).nbsp.tag(Tag.BUILDING).asterix().colon(Size.SMALL).resource(CardResource.AGENDA).br;
          b.text('(Action: When you play a card with a building tag, add 1 agenda on this card.)', Size.SMALL, false, false).br;
          b.resource(CardResource.AGENDA, {amount: 2, digit}).arrow(Size.SMALL).delegates(1).nbsp;
          b.resource(CardResource.AGENDA, {amount: 5, digit}).arrow(Size.SMALL).city().br;
          b.text('(Action: Spend 2 agenda resources to place 1 delegate in any party.)', Size.SMALL, false, false).br;
          b.text('(Action: Spend 5 agenda resources to place a city tile on Mars.)', Size.SMALL, false, false);
        }),
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
    if (card.tags.includes(Tag.BUILDING)) {
      player.addResourceTo(this, {qty: 1, log: true});
    }
  }

  private canAddDelegate(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    return this.resourceCount >= 2 && turmoil.getAvailableDelegateCount(player) > 0;
  }

  private canAddCity(player: IPlayer) {
    return this.resourceCount >= 5 && player.game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public canAct(player: IPlayer) {
    return this.canAddDelegate(player) || this.canAddCity(player);
  }

  public action(player: IPlayer) {
    const options = new OrOptions();

    if (this.canAddDelegate(player)) {
      options.options.push(new SelectOption('Spend 2 agendas to add a delegate to any party').andThen(() => {
        player.removeResourceFrom(this, 2);
        player.game.defer(new SendDelegateToArea(player));
        return undefined;
      }));
    }
    if (this.canAddCity(player)) {
      options.options.push(new SelectOption('Spend 5 agendas to place a city on Mars').andThen(() => {
        player.removeResourceFrom(this, 5);
        player.game.defer(new PlaceCityTile(player));
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
