import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Neil} from '../../../src/server/cards/ceos/Neil';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {LTFPrivileges} from '../../../src/server/cards/moon/LTFPrivileges';
import {ThoriumRush} from '../../../src/server/cards/moon/ThoriumRush';

describe('Neil', function() {
  let card: Neil;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let moonData: MoonData;

  beforeEach(() => {
    card = new Neil();
    [game, player, player2] = testGame(2, {ceoExtension: true, moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Gains 1 M€ when any player plays a Moon tag', function() {
    player.playedCards.push(card);

    player.playCard(new LTFPrivileges());
    expect(player.megaCredits).eq(1);

    player2.playCard(new ThoriumRush());
    expect(player.megaCredits).eq(2);
  });

  it('Takes action: Gains M€ production equal to lowest Moon rate', function() {
    moonData.habitatRate = 5;
    moonData.logisticRate = 4;
    moonData.miningRate = 2;

    card.action(player);
    expect(player.production.megacredits).eq(2);
  });

  it('Takes action: Gains M€ production equal to lowest Moon rate, two rates the same', function() {
    moonData.habitatRate = 5;
    moonData.logisticRate = 3;
    moonData.miningRate = 3;

    card.action(player);
    expect(player.production.megacredits).eq(3);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
