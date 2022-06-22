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
import {CardManifest} from './cards/CardManifest';
import {CardName} from './common/cards/CardName';
import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';
import {Deck} from './Deck';
import {GameModule} from './common/cards/GameModule';
import {GameOptions} from './Game';

export class CardLoader {
  private readonly gameOptions: GameOptions;
  private readonly manifests: Array<CardManifest>;

  public constructor(gameOptions: GameOptions) {
    this.gameOptions = gameOptions;

    const manifests: Array<[boolean, CardManifest]> = [
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

    this.manifests = manifests.filter((a) => a[0]).map((a) => a[1]);
  }

  private static include(gameOptions: GameOptions, cf: ICardFactory<ICard>): boolean {
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
        throw new Error(`Unhandled expansion type ${expansion} for card ${cf.cardName}`);
      }
    });
  }

  private addDeck<T extends ICard>(cards: Array<T>, deck: Deck<T>): void {
    deck.factories.forEach((cf) => {
      if (CardLoader.include(this.gameOptions, cf)) {
        cards.push(new cf.Factory());
      }
    });
  }

  public getProjectCards() {
    return this.getCards((manifest) => manifest.projectCards);
  }
  public getStandardProjects() {
    return this.getCards((manifest) => manifest.standardProjects);
  }
  public getCorporationCards() {
    return this.getCards((manifest) => manifest.corporationCards)
      .filter((card) => card.name !== CardName.BEGINNER_CORPORATION);
  }
  public getPreludeCards() {
    const preludes = this.getCards((manifest) => manifest.preludeCards);
    // https://github.com/terraforming-mars/terraforming-mars/issues/2833
    // Make Valley Trust playable even when Preludes is out of the game
    // by preparing a deck of preludes.
    if (preludes.length === 0) {
      this.addDeck(preludes, PRELUDE_CARD_MANIFEST.preludeCards);
    }
    return preludes;
  }

  private getCards<T extends ICard>(getDeck: (arg0: CardManifest) => Deck<T>) : Array<T> {
    const cards: Array<T> = [];
    for (const manifest of this.manifests) {
      this.addDeck(cards, getDeck(manifest));
    }
    return cards.filter((card) => {
      if (this.gameOptions.cardsBlackList.includes(card.name)) return false;
      for (const manifest of this.manifests) {
        if (manifest.cardsToRemove.has(card.name)) return false;
      }
      return true;
    });
  }
}
