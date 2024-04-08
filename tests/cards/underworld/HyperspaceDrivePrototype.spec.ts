import {expect} from 'chai';
import {HyperspaceDrivePrototype} from '../../../src/server/cards/underworld/HyperspaceDrivePrototype';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SpacePrivateers} from '../../../src/server/cards/underworld/SpacePrivateers';
import {TestPlayer} from '../../TestPlayer';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {IGame} from '../../../src/server/IGame';

describe('HyperspaceDrivePrototype', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: HyperspaceDrivePrototype;

  beforeEach(() => {
    card = new HyperspaceDrivePrototype();
    [game, player] = testGame(2);
  });

  it('canPlay', () => {
    player.tagsForTest = {science: 2};
    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.true;
  });

  const playRuns = [
    {it: 'fighters, no science', fighter: false, science: false, titanium: 1, tr: 21},
    {it: 'yes fighters, no science', fighter: true, science: false, titanium: 0, tr: 21},
    {it: 'no fighters, yes science', fighter: false, science: true, titanium: 1, tr: 20},
    {it: 'yes fighters, yes science', fighter: true, science: true, titanium: 0, tr: 20},
  ] as const;

  for (const run of playRuns) {
    it('canPlay ' + run.it, () => {
      const fighterCard = new SpacePrivateers();
      const scienceCard = new SearchForLife();
      if (run.fighter) {
        player.playedCards.push(fighterCard);
      }
      if (run.science) {
        player.playedCards.push(scienceCard);
      }
      expect(player.getTerraformRating()).eq(20);
      cast(card.play(player), undefined);
      runAllActions(game);
      expect(player.stock.titanium).eq(run.titanium);
      expect(player.getTerraformRating()).eq(run.tr);
      expect(fighterCard.resourceCount).eq(run.fighter ? 1 : 0);
      expect(scienceCard.resourceCount).eq(run.science ? 1 : 0);
    });
  }
});
