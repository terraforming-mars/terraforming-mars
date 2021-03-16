import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../ResourceType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Multiset} from '../../utils/Multiset';
import {Resources} from '../../Resources';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {StealResources} from '../../deferredActions/StealResources';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class TheDarksideofTheMoonSyndicate implements CorporationCard {
  public name = CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE;
  public startingMegaCredits = 40;
  public tags = [Tags.MOON];
  public cardType = CardType.CORPORATION;
  public resourceType = ResourceType.SYNDICATE_FLEET;
  public resourceCount = 0;

  public readonly metadata: CardMetadata = {
    description: 'You start with 40 MC and 2 syndicate fleets on this card.',
    cardNumber: '',
    renderData: CardRenderer.builder((b) => {
      b.megacredits(40).syndicateFleet(2).br;
      b
        .action('Spend 1 titanium to add 1 syndicate fleet on this card', (eb) => {
          eb.titanium(1).startAction.syndicateFleet(); // TODO: Add syndicate fleet
        })
        .br
        .action('Remove 1 syndicate fleet from this card to steal 8MC from any opponent.', (eb) => {
          eb.syndicateFleet().startAction.text('STEAL').megacredits(8);
        })
        .br
        .effect('When you place a tile on the Moon, steal 2 MC from the opponents for each tile of theirs placed next to yours.', (eb) => {
          eb.moonColony({size: CardRenderItemSize.SMALL}).slash().br
            .moonMine({size: CardRenderItemSize.SMALL}).slash()
            .moonRoad({size: CardRenderItemSize.SMALL}).asterix()
            .startAction.megacredits(-2).slash().emptyTile().emptyTile().asterix();
        });
    }),
  };

  public play() {
    this.resourceCount += 2;
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
      orOptions.options.push(new SelectOption('Remove 1 syndicate fleet from this card to steal 8MC from any opponent.', 'Remove syndicate fleet', () => {
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
    if (activePlayer !== cardOwner) {
      return undefined;
    }
    // Unlikely, but the compiler now thinks space.tile is defined.
    if (space.tile === undefined) {
      return undefined;
    }
    const game = activePlayer.game;
    switch (space.tile.tileType) {
    case TileType.MOON_COLONY:
    case TileType.MOON_MINE:
    case TileType.MOON_ROAD:
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
        activePlayer.setResource(Resources.MEGACREDITS, adjustedQuantity, game);
        target.setResource(Resources.MEGACREDITS, -adjustedQuantity, game, activePlayer);
      });
    }
    return undefined;
  }
}
