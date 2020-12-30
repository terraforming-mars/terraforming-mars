import {COLONIES_CARD_MANIFEST} from './cards/colonies/ColoniesCardManifest';
import {PRELUDE_CARD_MANIFEST} from './cards/prelude/PreludeCardManifest';
import {PROMO_CARD_MANIFEST} from './cards/promo/PromoCardManifest';
import {BASE_CARD_MANIFEST, CORP_ERA_CARD_MANIFEST} from './cards/StandardCardManifests';
import {TURMOIL_CARD_MANIFEST} from './cards/turmoil/TurmoilCardManifest';
import {VENUS_CARD_MANIFEST} from './cards/venusNext/VenusCardManifest';
import {COMMUNITY_CARD_MANIFEST} from './cards/community/CommunityCardManifest';
import {ARES_CARD_MANIFEST} from './cards/ares/AresCardManifest';
import {CardManifest} from './cards/CardManifest';
import {ICardFactory} from './cards/ICardFactory';
import {CardTypes, Deck} from './Deck';
import {GameModule} from './GameModule';
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
    ];

    this.manifests = manifests.filter((a) => a[0]).map((a) => a[1]);
  }

  private static include(gameOptions: GameOptions) {
    return function(cf: ICardFactory<CardTypes>): boolean {
      const expansion = cf.compatibility;
      switch (expansion) {
      case undefined:
        return true;
      case GameModule.Venus:
        return gameOptions.venusNextExtension;
      case GameModule.Colonies:
        return gameOptions.coloniesExtension;
      case GameModule.Turmoil:
        return gameOptions.turmoilExtension;
      default:
        throw ('Unhandled expansion type: ' + expansion);
      }
    };
  }

  private addDeck<T extends CardTypes>(cards: Array<T>, deck: Deck<T>): void {
    const cardInstances = deck.cards
      .filter(CardLoader.include(this.gameOptions))
      .map((cf) => new cf.Factory());
    cards.push(...cardInstances);
  }

  public getProjectCards() {
    return this.getCards((manifest) => manifest.projectCards);
  }
  public getStandardProjects() {
    return this.getCards((manifest) => manifest.standardProjects);
  }
  public getCorporationCards() {
    return this.getCards((manifest) => manifest.corporationCards);
  }
  public getPreludeCards() {
    return this.getCards((manifest) => manifest.preludeCards);
  }

  private getCards<T extends CardTypes>(getDeck: (arg0: CardManifest) => Deck<T>) : Array<T> {
    const cards: Array<T> = [];
    for (const manifest of this.manifests) {
      this.addDeck(cards, getDeck(manifest));
    }
    return cards.filter((card) => {
      if (this.gameOptions.cardsBlackList.includes(card.name)) return false;
      for (const manifest of this.manifests) {
        if (manifest.cardsToRemove.includes(card.name)) return false;
      }
      return true;
    });
  }
}
