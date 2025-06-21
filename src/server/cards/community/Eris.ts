import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {IGame} from '../../IGame';
import {CardName} from '../../../common//cards/CardName';
import {PlaceHazardTile} from '../../deferredActions/PlaceHazardTile';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Size} from '../../../common/cards/render/Size';
import {TileType, tileTypeToString} from '../../../common/TileType';
import {LogHelper} from '../../LogHelper';
import {AresHandler} from '../../ares/AresHandler';
import {ICorporationCard} from '../corporation/ICorporationCard';

const ARES_CARDS = [
  CardName.BIOENGINEERING_ENCLOSURE,
  CardName.BIOFERTILIZER_FACILITY,
  CardName.BUTTERFLY_EFFECT,
  CardName.CAPITAL_ARES,
  CardName.COMMERCIAL_DISTRICT_ARES,
  CardName.DEIMOS_DOWN_ARES,
  CardName.DESPERATE_MEASURES,
  CardName.ECOLOGICAL_SURVEY,
  CardName.ECOLOGICAL_ZONE_ARES,
  CardName.GEOLOGICAL_SURVEY,
  CardName.GREAT_DAM_ARES,
  CardName.INDUSTRIAL_CENTER_ARES,
  CardName.LAVA_FLOWS_ARES,
  CardName.MAGNETIC_FIELD_GENERATORS_ARES,
  CardName.MARKETING_EXPERTS,
  CardName.METALLIC_ASTEROID,
  CardName.MINING_AREA_ARES,
  CardName.MINING_RIGHTS_ARES,
  CardName.MOHOLE_AREA_ARES,
  CardName.NATURAL_PRESERVE_ARES,
  CardName.NUCLEAR_ZONE_ARES,
  CardName.OCEAN_CITY,
  CardName.OCEAN_FARM,
  CardName.OCEAN_SANCTUARY,
  CardName.RESTRICTED_AREA_ARES,
  CardName.SOLAR_FARM,
];

export class Eris extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.ERIS,
      tags: [Tag.BUILDING],
      initialActionText: 'Draw an Ares card',
      startingMegaCredits: 46,

      metadata: {
        cardNumber: 'R47',
        description: 'You start with 46 M€. As your first action, draw an Ares card.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(46).nbsp.cards(1, {secondaryTag: AltSecondaryTag.ARES});
          b.corpBox('action', (ce) => {
            ce.action('Place a new hazard tile adjacent to NO OTHER TILE, OR remove a hazard tile to gain 1 TR.', (eb) => {
              eb.empty().startAction.plus().hazardTile().slash().minus().hazardTile().colon().tr(1, {size: Size.SMALL});
            });
          });
        }),
      },
    });
  }

  public initialAction(player: IPlayer) {
    this.drawAresCard(player);
    return undefined;
  }

  public canAct(player: IPlayer): boolean {
    const game = player.game;
    const availableSpaces = this.getAvailableSpaces(player);
    const hazardSpaces = Eris.getAllUnprotectedHazardSpaces(game);

    if (availableSpaces.length === 0 && hazardSpaces.length === 0) return false;
    return true;
  }

  public action(player: IPlayer) {
    const game = player.game;
    const orOptions = new OrOptions();
    const availableSpaces = this.getAvailableSpaces(player);
    const hazardSpaces = Eris.getAllUnprotectedHazardSpaces(game);

    if (availableSpaces.length > 0) {
      orOptions.options.push(new SelectOption('Place a hazard tile adjacent to no other tile', 'Select').andThen(() => {
        const title = 'Select space next to no other tile for hazard';
        game.defer(new PlaceHazardTile(player, TileType.EROSION_MILD, {title, spaces: availableSpaces}));
        return undefined;
      }));
    }

    if (hazardSpaces.length > 0 && player.canAfford({cost: 0, tr: {tr: 1}})) {
      orOptions.options.push(new SelectOption('Remove a hazard tile to gain 1 TR', 'Select').andThen(() => {
        return new SelectSpace(
          'Select hazard tile to remove',
          Eris.getAllUnprotectedHazardSpaces(game)).andThen(
          (space) => {
            const tileType = space.tile?.tileType;

            // Unnecessary type check
            if (tileType === undefined) {
              return;
            }

            space.tile = undefined;
            player.increaseTerraformRating(1, {log: true});
            LogHelper.logBoardTileAction(player, space, tileTypeToString[tileType], 'removed');
            AresHandler.ifAres(game, (aresData) => {
              AresHandler.incrementPurifier(aresData, player);
            });
            return undefined;
          },
        );
      }));
    }

    if (orOptions.options.length === 1) return orOptions.options[0].cb();
    return orOptions;
  }

  private drawAresCard(player: IPlayer) {
    player.drawCard(1, {include: (card) => ARES_CARDS.includes(card.name)});

    return undefined;
  }

  private getAvailableSpaces(player: IPlayer) {
    const board = player.game.board;
    return board.getAvailableSpacesOnLand(player)
      .filter(((space) => space.tile === undefined))
      .filter((space) => {
        const adjacentSpaces = board.getAdjacentSpaces(space);
        return adjacentSpaces.filter((space) => space.tile !== undefined).length === 0;
      });
  }

  public static getAllUnprotectedHazardSpaces(game: IGame) {
    return game.board.getHazards().filter((space) => space.tile?.protectedHazard !== true);
  }
}
