import {COLONIES_CARD_MANIFEST} from './cards/colonies/ColoniesCardManifest';
import {PRELUDE_CARD_MANIFEST} from './cards/prelude/PreludeCardManifest';
import {PROMO_CARD_MANIFEST} from './cards/promo/PromoCardManifest';
import {BASE_CARD_MANIFEST, CORP_ERA_CARD_MANIFEST} from './cards/StandardCardManifests';
import {TURMOIL_CARD_MANIFEST} from './cards/turmoil/TurmoilCardManifest';
import {VENUS_CARD_MANIFEST} from './cards/venusNext/VenusCardManifest';
import {COMMUNITY_CARD_MANIFEST} from './cards/community/CommunityCardManifest';
import {ARES_CARD_MANIFEST} from './cards/ares/AresCardManifest';
import {MOON_CARD_MANIFEST} from './cards/moon/MoonCardManifest';
import {PATHFINDERS_CARD_MANIFEST} from './cards/pathfinders/PathfindersCardManifest';
import {CardManifest, ModuleManifest} from './cards/ModuleManifest';
import {CardName} from '../common/cards/CardName';
import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';
import {GameModule} from '../common/cards/GameModule';
import {GameOptions} from './GameOptions';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {IProjectCard} from './cards/IProjectCard';
import {IStandardProjectCard} from './cards/IStandardProjectCard';
import {CardFinder} from './CardFinder';
import {IPreludeCard} from './cards/prelude/IPreludeCard';

/**
 * Returns the cards available to a game based on its `GameOptions`.
 *
 * It only includes manifests appropriate to the modules for the game,
 * and considers the banned cards, and extra-module compatibility
 * (e.g. cards in one module that can't be played without another one.)
 *
 * Therefore, this is only used when constructing a brand new instance.
 *
 * ... and one other place. When trying to determine the available standard
 * projects for a game. This is just done on the fly all the time, rather
 * that store them. (We should fix that.)
 */
export class GameCards {
  private readonly gameOptions: GameOptions;
  private readonly moduleManifests: Array<ModuleManifest>;
  private readonly cardFinder: CardFinder = new CardFinder();

  public constructor(gameOptions: GameOptions) {
    this.gameOptions = gameOptions;

    const manifests: Array<[boolean, ModuleManifest]> = [
      [true, BASE_CARD_MANIFEST],
      [gameOptions.corporateEra, CORP_ERA_CARD_MANIFEST],
      [gameOptions.preludeExtension, PRELUDE_CARD_MANIFEST],
      [gameOptions.venusNextExtension, VENUS_CARD_MANIFEST],
      [gameOptions.coloniesExtension, COLONIES_CARD_MANIFEST],
      [gameOptions.turmoilExtension, TURMOIL_CARD_MANIFEST],
      [gameOptions.aresExtension, ARES_CARD_MANIFEST],
      [gameOptions.promoCardsOption, PROMO_CARD_MANIFEST],
      [gameOptions.communityCardsOption, COMMUNITY_CARD_MANIFEST],
      [gameOptions.moonExpansion, MOON_CARD_MANIFEST],
      [gameOptions.pathfindersExpansion, PATHFINDERS_CARD_MANIFEST],
    ];

    this.moduleManifests = manifests.filter((a) => a[0]).map((a) => a[1]);
  }

  private static isCompatibleWith(cf: ICardFactory<ICard>, gameOptions: GameOptions): boolean {
    if (cf.compatibility === undefined) {
      return true;
    }
    const expansions: Array<GameModule> = Array.isArray(cf.compatibility) ? cf.compatibility : [cf.compatibility];
    return expansions.every((expansion) => {
      switch (expansion) {
      case 'venus':
        return gameOptions.venusNextExtension;
      case 'colonies':
        return gameOptions.coloniesExtension;
      case 'turmoil':
        return gameOptions.turmoilExtension;
      case 'moon':
        return gameOptions.moonExpansion;
      case 'pathfinders':
        return gameOptions.pathfindersExpansion;
      default:
        throw new Error(`Unhandled expansion type ${expansion}`);
      }
    });
  }

  private instantiate<T extends ICard>(manifest: CardManifest<T>): Array<T> {
    return CardManifest.values(manifest)
      .filter((factory) => GameCards.isCompatibleWith(factory, this.gameOptions))
      .map((factory) => new factory.Factory());
  }

  public getProjectCards() {
    return this.getCards<IProjectCard>('projectCards');
  }
  public getStandardProjects() {
    return this.getCards<IStandardProjectCard>('standardProjects');
  }
  public getCorporationCards(): Array<ICorporationCard> {
    const cards = this.getCards<ICorporationCard>('corporationCards')
      .filter((card) => card.name !== CardName.BEGINNER_CORPORATION);
    return this.addCustomCards(cards, this.gameOptions.customCorporationsList);
  }
  public getPreludeCards() {
    let preludes = this.getCards<IPreludeCard>('preludeCards');
    // https://github.com/terraforming-mars/terraforming-mars/issues/2833
    // Make Valley Trust playable even when Preludes is out of the game
    // by preparing a deck of preludes.
    if (preludes.length === 0) {
      preludes = this.instantiate(PRELUDE_CARD_MANIFEST.preludeCards);
    }
    return this.addCustomCards(preludes, this.gameOptions.customPreludes);
  }

  private addCustomCards<T extends ICard>(cards: Array<T>, customList: Array<CardName> = []): Array<T> {
    for (const cardName of customList) {
      const idx = cards.findIndex((c) => c.name === cardName);
      if (idx === -1) {
        const card = this.cardFinder.getCardByName(cardName);
        if (card === undefined) {
          // TODO(kberg): throw an error.
          console.warn(`Unknown card: ${cardName}`);
        }
        cards.push(<T> card);
      }
    }
    return cards;
  }

  private getCards<T extends ICard>(cardManifestName: keyof ModuleManifest) : Array<T> {
    let cards: Array<T> = [];
    for (const moduleManifest of this.moduleManifests) {
      // a bit of a hack, but since this is a private API, this is reasonable.
      const cardManifest: CardManifest<T> = moduleManifest[cardManifestName] as CardManifest<T>;
      cards.push(...this.instantiate(cardManifest));
    }

    cards = this.filterBannedCards(cards);
    cards = this.filterReplacedCards(cards);
    return cards;
  }

  /* Remove cards excluded by choice in game options */
  private filterBannedCards<T extends ICard>(cards: Array<T>): Array<T> {
    return cards.filter((card) => {
      return this.gameOptions.bannedCards.includes(card.name) !== true;
    });
  }

  /* Remove cards that are replaced by new versions in other manifests */
  private filterReplacedCards<T extends ICard>(cards: Array<T>): Array<T> {
    return cards.filter((card) => {
      for (const manifest of this.moduleManifests) {
        if (manifest.cardsToRemove.has(card.name)) return false;
      }
      return true;
    });
  }
}
