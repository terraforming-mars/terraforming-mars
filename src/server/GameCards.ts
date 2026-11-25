import {PRELUDE_CARD_MANIFEST} from './cards/prelude/PreludeCardManifest';
import {CardManifest, ModuleManifest} from './cards/ModuleManifest';
import {ALL_MODULE_MANIFESTS} from '@/server/cards/AllManifests';
import {CardName} from '../common/cards/CardName';
import {ICard} from './cards/ICard';
import {isCompatibleWith} from './cards/CardFactorySpec';
import {GameOptions} from './game/GameOptions';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {isIProjectCard, IProjectCard} from './cards/IProjectCard';
import {IStandardProjectCard} from './cards/IStandardProjectCard';
import {newCard} from './createCard';
import {resolveCardName} from '../common/cards/CardRenames';
import {IPreludeCard} from './cards/prelude/IPreludeCard';
import {ICeoCard} from './cards/ceos/ICeoCard';
import {GameModule} from '@/common/cards/GameModule';
import {comparing} from '@/common/utils/Ordering';

/**
 * Module order for building decks.
 *
 * Changing it changes the decks a given seed produces.
 */
const DECK_MODULE_ORDER: ReadonlyArray<GameModule> = [
  'base',
  'corpera',
  'prelude',
  'prelude2',
  'venus',
  'colonies',
  'turmoil',
  'ares',
  'promo',
  'community',
  'moon',
  'pathfinders',
  'ceo',
  'starwars',
  'underworld',
  'deltaProject',
];

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
 * projects for a game.
 */
export class GameCards {
  private readonly gameOptions: GameOptions;
  private readonly moduleManifests: Array<ModuleManifest>;

  public constructor(gameOptions: GameOptions) {
    this.gameOptions = gameOptions;

    this.moduleManifests = ALL_MODULE_MANIFESTS
      .filter((manifest) => manifest.module === 'base' || gameOptions.expansions[manifest.module])
      .toSorted(comparing((manifest) => DECK_MODULE_ORDER.indexOf(manifest.module)));
  }

  private instantiate<T extends ICard>(manifest: CardManifest<T>): Array<T> {
    return CardManifest.values(manifest)
      .filter((factory) => factory.instantiate !== false)
      .filter((factory) => isCompatibleWith(factory, this.gameOptions))
      .map((factory) => new factory.Factory());
  }

  public getProjectCards() {
    const cards = this.getCards<IProjectCard>('projectCards');
    this.addCustomCards(cards, this.gameOptions.includedCards);
    return cards.filter(isIProjectCard);
  }
  public getStandardProjects() {
    return this.getCards<IStandardProjectCard>('standardProjects');
  }
  public getCorporationCards(): Array<ICorporationCard> {
    return this.getCustomCards<ICorporationCard>(this.gameOptions.customCorporationsList) ??
      this.getCards<ICorporationCard>('corporationCards')
        .filter((card) => card.name !== CardName.BEGINNER_CORPORATION);
  }
  public getPreludeCards() {
    let preludes = this.getCustomCards<IPreludeCard>(this.gameOptions.customPreludes);
    if (!preludes) {
      preludes = this.getCards<IPreludeCard>('preludeCards');
      // https://github.com/terraforming-mars/terraforming-mars/issues/2833
      // Make Valley Trust playable even when Preludes is out of the game
      // by preparing a deck of preludes.
      if (preludes.length === 0) {
        preludes = this.instantiate(PRELUDE_CARD_MANIFEST.preludeCards);
      }
    }

    if (this.gameOptions.twoCorpsVariant) {
      // As each player who doesn't have Merger is dealt Merger in SelectInitialCards.ts,
      // remove it from the deck to avoid possible conflicts (e.g. Valley Trust / New Partner)
      preludes = preludes.filter((c) => c.name !== CardName.MERGER);
    }
    // Every player is dealt Delta Project during game setup, so it never belongs in the deck.
    return preludes.filter((c) => c.name !== CardName.DELTA_PROJECT);
  }

  public getCeoCards() {
    return this.getCustomCards<ICeoCard>(this.gameOptions.customCeos) ??
      this.getCards<ICeoCard>('ceoCards');
  }

  /**
   * Instantiate every card in `customList` and add them to `cards` (except those that already exist in `cards`),
   */
  private addCustomCards<T extends ICard>(cards: Array<T>, customCards: ReadonlyArray<CardName> = []): void {
    for (const cardName of customCards) {
      const canonicalName = resolveCardName(cardName);
      if (cards.findIndex((c) => c.name === canonicalName) > -1) {
        continue;
      }
      const card = newCard(cardName);
      cards.push(<T> card);
    }
  }

  /*
   * Instantiates the cards named in `customCards`, or `undefined` when `customCards` is empty.
   */
  private getCustomCards<T extends ICard>(customCards: ReadonlyArray<CardName>) {
    if (customCards.length === 0) {
      return undefined;
    }
    const names = new Set(customCards.map(resolveCardName));
    return Array.from(names, (name) => <T> newCard(name));
  }

  /*
   * Instantiates the `cardManifestName` cards from every module enabled in this game.
   *
   * Excludes cards that are incompatible with the game options, banned, or replaced by another module.
   */
  private getCards<T extends ICard>(cardManifestName: keyof ModuleManifest) : Array<T> {
    const cards: Array<T> = [];
    for (const moduleManifest of this.moduleManifests) {
      // a bit of a hack, but since this is a private API, this is reasonable.
      const cardManifest: CardManifest<T> = moduleManifest[cardManifestName] as CardManifest<T>;
      cards.push(...this.instantiate(cardManifest));
    }

    const filtered = cards.filter((card) => {
      // Remove banned cards
      if (this.gameOptions.bannedCards.includes(card.name)) {
        return false;
      }

      // Remove cards that are replaced by new versions in other manifests
      for (const manifest of this.moduleManifests) {
        if (manifest.cardsToRemove.has(card.name)) {
          return false;
        }
      }

      return true;
    });
    return filtered;
  }
}
