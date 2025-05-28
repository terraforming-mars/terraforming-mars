import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Warmonger} from '../../../src/server/awards/terraCimmeria/Warmonger';
import {TestPlayer} from '../../TestPlayer';
import {newCard} from '../../../src/server/createCard';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {TheDarksideofTheMoonSyndicate} from '../../../src/server/cards/moon/TheDarksideofTheMoonSyndicate';
import {CardType} from '../../../src/common/cards/CardType';
import {CardName} from '../../../src/common/cards/CardName';
import {ALL_MODULE_MANIFESTS} from '../../../src/server/cards/AllManifests';
import {CardManifest} from '../../../src/server/cards/ModuleManifest';

describe('Warmonger', () => {
  let award: Warmonger;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Warmonger();
    [/* game */, player] = testGame(2);
  });

  it('score', () => {
    player.playedCards = [];
    expect(award.getScore(player)).eq(0);

    // Tardigrades does not take from another card or player.
    player.playedCards.push(new Tardigrades());
    expect(award.getScore(player)).eq(0);

    player.playedCards.push(new Ants());
    expect(award.getScore(player)).eq(1);

    // Big Asteroid is an event, and counts.
    player.playedCards.push(new BigAsteroid());
    expect(award.getScore(player)).eq(2);

    player.corporations.push(new TheDarksideofTheMoonSyndicate());
    expect(award.getScore(player)).eq(3);
  });

  const expectedEvents: ReadonlyArray<CardName> = [CardName.AIR_RAID, CardName.ASTEROID, CardName.ANTI_TRUST_CRACKDOWN, CardName.BIG_ASTEROID,
    CardName.CORPORATE_THEFT, CardName.COMET, CardName.CLASS_ACTION_LAWSUIT,
    CardName.CORPORATE_BLACKMAIL, CardName.DEEPNUKING, CardName.DEIMOS_DOWN, CardName.DEIMOS_DOWN_ARES, CardName.DEIMOS_DOWN_PROMO,
    CardName.DUST_STORM, CardName.FLOODING, CardName.GIANT_ICE_ASTEROID, CardName.HIRED_RAIDERS, CardName.HIRED_RAIDERS_UNDERWORLD,
    CardName.IMPACTOR_SWARM, CardName.INFRASTRUCTURE_OVERLOAD, /* CardName.LAW_SUIT is ignored */
    CardName.METALLIC_ASTEROID, CardName.MINING_EXPEDITION, CardName.MONOPOLY, CardName.PLANT_TAX, CardName.RECKLESS_DETONATION,
    CardName.REVOLTING_COLONISTS, CardName.ROAD_PIRACY, CardName.SABOTAGE, CardName.SERVER_SABOTAGE,
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
      expect(Warmonger.autoInclude(card)).to.be.false;
    });
  }
});
