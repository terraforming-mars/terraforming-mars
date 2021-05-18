import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../ResourceType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Multiset} from '../../utils/Multiset';
import {Resources} from '../../Resources';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {StealResources} from '../../deferredActions/StealResources';
import {Size} from '../render/Size';
import {Phase} from '../../Phase';
import {Card} from '../Card';

export class TheDarksideofTheMoonSyndicate extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE,
      tags: [Tags.MOON],
      startingMegaCredits: 40,
      resourceType: ResourceType.SYNDICATE_FLEET,

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).syndicateFleet(2).br;
          b.text('You start with 40 M€ and 2 syndicate fleets on this card.', Size.SMALL, false, false).br;
          b.titanium(1).arrow(Size.SMALL).syndicateFleet()
            .slash(Size.SMALL)
            .syndicateFleet().arrow(Size.SMALL).text('steal', Size.TINY).megacredits(8).any.br;
          b.text('Action: Spend 1 titanium to add 1 syndicate fleet on this card OR remove 1 syndicate fleet from this card to steal 8M€ from any opponent.', Size.TINY, false, false).br;
          b
            .effect('When you place a tile on the Moon, steal 2 M€ from opponents for each of their tiles next to yours.', (eb) => {
              eb.emptyTile('normal', Size.SMALL).secondaryTag(Tags.MOON)
                .startEffect
                .text('STEAL').megacredits(2).any.slash().emptyTile('normal', Size.SMALL).emptyTile('normal', Size.SMALL).any;
            });
        }),
      },
    });
  }

  public resourceCount = 0;

  public play(player: Player) {
    player.addResourceTo(this, 2);
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.titanium > 0 || this.resourceCount > 0;
  }

  public action(player: Player) {
    const orOptions = new OrOptions();
    if (player.titanium > 0) {
      orOptions.options.push(new SelectOption('Spend 1 titanium to add 1 syndicate fleet on this card', 'Add syndicate fleet', () => {
        player.titanium--;
        player.addResourceTo(this);
        return undefined;
      }));
    }
    if (this.resourceCount > 0) {
      orOptions.options.push(new SelectOption('Remove 1 syndicate fleet from this card to steal 8M€ from any opponent.', 'Remove syndicate fleet', () => {
        player.removeResourceFrom(this);
        player.game.defer(new StealResources(player, Resources.MEGACREDITS, 8));
        return undefined;
      }));
    }

    if (orOptions.options.length === 1) {
      return orOptions.options[0].cb();
    }
    return orOptions;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
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
      const costs = new Multiset<Player>();
      MoonExpansion.moonData(game).moon.getAdjacentSpaces(space).forEach((space) => {
        if (space.tile !== undefined && space.player !== undefined && space.player !== activePlayer) {
          costs.add(space.player, 2);
        }
      });
      costs.entries().forEach(([target, qty]) => {
        // TODO(kberg): Create a Game.steal method that manages this, both here
        // and in StealResources.
        const adjustedQuantity = Math.min(qty, target.megaCredits);
        activePlayer.addResource(Resources.MEGACREDITS, adjustedQuantity, {log: true});
        target.deductResource(Resources.MEGACREDITS, adjustedQuantity, {log: true, from: activePlayer});
      });
    }
    return undefined;
  }
}
