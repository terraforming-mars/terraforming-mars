import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {MultiSet} from 'mnemonist';
import {Resource} from '../../../common/Resource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Size} from '../../../common/cards/render/Size';
import {Phase} from '../../../common/Phase';
import {all} from '../Options';
import {Payment} from '../../../common/inputs/Payment';

export class TheDarksideofTheMoonSyndicate extends CorporationCard {
  constructor() {
    super({
      name: CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE,
      tags: [Tag.MOON],
      startingMegaCredits: 40,
      resourceType: CardResource.SYNDICATE_FLEET,

      behavior: {
        addResources: 2,
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).syndicateFleet(2).br;
          b.text('You start with 40 M€ and 2 syndicate fleets on this card.', Size.SMALL, false, false).br;
          b.titanium(1).arrow(Size.SMALL).syndicateFleet()
            .slash(Size.SMALL)
            .syndicateFleet().arrow(Size.SMALL).text('steal', Size.TINY).megacredits(2, {all}).asterix().br;
          b.text('Action: Spend 1 titanium to add 1 syndicate fleet on this card OR ' +
                'remove 1 syndicate fleet from this card to steal 2M€ from every opponent.', Size.TINY, false, false).br;
          b.effect('When you place a tile on The Moon, steal 2 M€ from opponents for each of their tiles next to yours.', (eb) => {
            eb.emptyTile('normal', {size: Size.SMALL, secondaryTag: Tag.MOON})
              .startEffect
              .text('STEAL').megacredits(2, {all}).slash().emptyTile('normal', {size: Size.SMALL}).emptyTile('normal', {size: Size.SMALL, all});
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.titanium > 0 || this.resourceCount > 0;
  }

  public action(player: IPlayer) {
    const orOptions = new OrOptions();
    if (player.titanium > 0) {
      orOptions.options.push(new SelectOption('Spend 1 titanium to add 1 syndicate fleet on this card', 'Add syndicate fleet').andThen(() => {
        player.pay(Payment.of({titanium: 1}));
        player.addResourceTo(this, {qty: 1, log: true});
        return undefined;
      }));
    }
    if (this.resourceCount > 0) {
      orOptions.options.push(new SelectOption('Remove 1 syndicate fleet from this card to steal 2M€ from every opponent.', 'Remove syndicate fleet').andThen(() => {
        player.removeResourceFrom(this);
        const game = player.game;
        for (const target of game.getPlayers()) {
          if (target === player) continue;
          target.maybeBlockAttack(player, (proceed) => {
            if (proceed) {
              target.stock.steal(Resource.MEGACREDITS, 2, player);
            }
            return undefined;
          });
        }
        return undefined;
      }));
    }

    if (orOptions.options.length === 1) {
      return orOptions.options[0].cb();
    }
    return orOptions;
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (activePlayer.game.phase === Phase.SOLAR) {
      return;
    }
    if (activePlayer !== cardOwner) {
      return undefined;
    }
    // Unlikely, but the compiler now thinks space.tile is defined.
    if (space.tile === undefined) {
      return undefined;
    }
    const game = activePlayer.game;
    if (MoonExpansion.MOON_TILES.has(space.tile.tileType)) {
      const costs = new MultiSet<IPlayer>();
      MoonExpansion.moonData(game).moon.getAdjacentSpaces(space).forEach((space) => {
        if (space.tile !== undefined && space.player !== undefined && space.player !== activePlayer) {
          costs.add(space.player, 2);
        }
      });
      costs.forEachMultiplicity((qty, target) => {
        // TODO(kberg): Create a Game.steal method that manages this, both here
        // and in StealResources.
        const adjustedQuantity = Math.min(qty, target.megaCredits);
        activePlayer.stock.add(Resource.MEGACREDITS, adjustedQuantity, {log: true});
        target.stock.deduct(Resource.MEGACREDITS, adjustedQuantity, {log: true, from: activePlayer});
      });
    }
    return undefined;
  }
}
