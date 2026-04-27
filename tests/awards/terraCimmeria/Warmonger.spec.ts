import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Warmonger} from '../../../src/server/awards/terraCimmeria/Warmonger';
import {TestPlayer} from '../../TestPlayer';
import {newCard} from '../../../src/server/createCard';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {TheDarksideofTheMoonSyndicate} from '../../../src/server/cards/moon/TheDarksideofTheMoonSyndicate';
import {LawSuit} from '../../../src/server/cards/promo/LawSuit';
import {AstraMechanica} from '../../../src/server/cards/promo/AstraMechanica';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';
import {CardName} from '../../../src/common/cards/CardName';
import {ALL_MODULE_MANIFESTS} from '../../../src/server/cards/AllManifests';
import {CardManifest} from '../../../src/server/cards/ModuleManifest';

describe('Warmonger', () => {
  let award: Warmonger;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    award = new Warmonger();
    [/* game */, player, player2] = testGame(2);
  });

  it('score', () => {
    expect(award.getScore(player)).eq(0);

    // Tardigrades does not take from another card or player.
    player.playedCards.push(new Tardigrades());
    expect(award.getScore(player)).eq(0);

    player.playedCards.push(new Ants());
    expect(award.getScore(player)).eq(1);

    // Big Asteroid is an event, and counts.
    player.playedCards.push(new BigAsteroid());
    expect(award.getScore(player)).eq(2);

    player.playedCards.push(new TheDarksideofTheMoonSyndicate());
    expect(award.getScore(player)).eq(3);
  });

  it('Playing Lawsuit increments warmongerCards and counts toward the award', () => {
    const lawsuit = new LawSuit();

    // player1 already has two warmonger-compatible cards in play.
    player.playedCards.push(new Ants(), new BigAsteroid());
    expect(award.getScore(player)).eq(2);

    player.removingPlayers.push(player2.id);
    player2.megaCredits = 3;

    const selectPlayer = cast(lawsuit.play(player), SelectPlayer);
    selectPlayer.cb(player2);

    expect(player.warmongerCards).eq(1);
    expect(player2.warmongerCards).eq(0);
    expect(award.getScore(player)).eq(3);
    expect(award.getScore(player2)).eq(0);
  });

  it('Astra Mechanica returns Lawsuit to hand; playing it again raises warmonger twice', () => {
    const lawsuit = new LawSuit();
    const astraMechanica = new AstraMechanica();

    player.removingPlayers.push(player2.id);
    player2.megaCredits = 3;

    const firstPlay = cast(lawsuit.play(player), SelectPlayer);
    firstPlay.cb(player2);

    expect(player.warmongerCards).eq(1);
    expect(player2.playedCards.asArray()).to.include(lawsuit);

    // player2 uses Astra Mechanica to return Lawsuit to their hand.
    const selectCard = cast(astraMechanica.play(player2), SelectCard);
    selectCard.cb([lawsuit]);

    expect(player2.playedCards.asArray()).to.not.include(lawsuit);
    expect(player2.cardsInHand).to.include(lawsuit);

    // player2 now sues player1 with the same card.
    player2.removingPlayers.push(player.id);
    player.megaCredits = 3;

    const secondPlay = cast(lawsuit.play(player2), SelectPlayer);
    secondPlay.cb(player);

    expect(player.warmongerCards).eq(1);
    expect(player2.warmongerCards).eq(1);
    expect(award.getScore(player)).eq(1);
    expect(award.getScore(player2)).eq(1);
  });

  const expectedEvents: ReadonlyArray<CardName> = [CardName.AIR_RAID, CardName.ASTEROID, CardName.ANTI_TRUST_CRACKDOWN, CardName.BIG_ASTEROID,
    CardName.CORPORATE_THEFT, CardName.COMET, CardName.CLASS_ACTION_LAWSUIT, CardName.CORPORATE_BLACKMAIL, CardName.COMET_FOR_VENUS,
    CardName.DEEPNUKING, CardName.DEIMOS_DOWN, CardName.DEIMOS_DOWN_ARES, CardName.DEIMOS_DOWN_PROMO,
    CardName.DUST_STORM, CardName.FLOODING, CardName.GIANT_ICE_ASTEROID, CardName.HIRED_RAIDERS, CardName.HIRED_RAIDERS_UNDERWORLD,
    CardName.IMPACTOR_SWARM, CardName.INFRASTRUCTURE_OVERLOAD, /* CardName.LAW_SUIT is counted via player.warmongerCards */ CardName.MERCENARY_SQUAD,
    CardName.METALLIC_ASTEROID, CardName.MINING_EXPEDITION, CardName.MONOPOLY, CardName.PUBLIC_SPONSORED_GRANT, CardName.PLANT_TAX,
    CardName.RECKLESS_DETONATION, CardName.REVOLTING_COLONISTS, CardName.ROAD_PIRACY, CardName.SABOTAGE,
    CardName.SMALL_ASTEROID, CardName.SMALL_COMET, CardName.SOLAR_STORM, CardName.SPECIAL_PERMIT,
    CardName.VIRUS,
  ] as const;
  for (const manifest of ALL_MODULE_MANIFESTS) {
    for (const projectCard of CardManifest.values(manifest.projectCards)) {
      const card = new projectCard.Factory();
      if (card.type !== CardType.EVENT) {
        continue;
      }
      it('Testing event ' + card.name, () => {
        const actual = Warmonger.include(card);
        const expected = expectedEvents.includes(card.name);
        expect(actual).to.eq(expected);
      });
    }
  }

  // A good way to prevent future failures is to duplicate the Robotic Workforce style of test.
  for (const cardName of Warmonger.attackCards) {
    it('verify manual card ' + cardName, () => {
      const card = newCard(cardName);
      if (card === undefined) {
        console.log('Skipping ' + cardName);
        return;
      }
      expect(Warmonger.autoInclude(card), 'This card is manually listed but is automatically identified.').to.be.false;
    });
  }
});
