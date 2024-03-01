import {expect} from 'chai';
import {SoilEnrichment} from '../../../src/server/cards/promo/SoilEnrichment';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {NitriteReducingBacteria} from '../../../src/server/cards/base/NitriteReducingBacteria';

describe('SoilEnrichment', function() {
  let card: SoilEnrichment;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SoilEnrichment();
    [/* game*/, player] = testGame(2);
  });

  const canPlayRuns = [
    {ghgResources: 0, searchForLifeResources: 0, expected: false},
    {ghgResources: 0, searchForLifeResources: 1, expected: false},
    {ghgResources: 1, searchForLifeResources: 0, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canplay ' + JSON.stringify(run), function() {
      const ghgProducingBacteria = new GHGProducingBacteria();
      const searchForLife = new SearchForLife();
      ghgProducingBacteria.resourceCount = run.ghgResources;
      searchForLife.resourceCount = run.searchForLifeResources,
      player.playedCards.push(ghgProducingBacteria, searchForLife);

      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', function() {
    const ghgProducingBacteria = new GHGProducingBacteria();
    const tardigrades = new Tardigrades();
    const nitriteReducingBacteria = new NitriteReducingBacteria();
    ghgProducingBacteria.resourceCount = 1;
    tardigrades.resourceCount = 1;
    nitriteReducingBacteria.resourceCount = 0;
    player.playedCards.push(ghgProducingBacteria, tardigrades, nitriteReducingBacteria);

    player.plants = 0;
    expect(card.canPlay(player)).is.true;

    const selectCard = cast(card.play(player), SelectCard);
    expect(selectCard.cards).to.have.members([ghgProducingBacteria, tardigrades]);
    selectCard.cb([tardigrades]);

    expect(tardigrades.resourceCount).eq(0);
    expect(player.plants).eq(5);
  });
});
