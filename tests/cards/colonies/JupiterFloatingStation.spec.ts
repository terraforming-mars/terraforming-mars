import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {JupiterFloatingStation} from '../../../src/server/cards/colonies/JupiterFloatingStation';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('JupiterFloatingStation', function() {
  let card: JupiterFloatingStation;
  let player: TestPlayer;

  beforeEach(function() {
    card = new JupiterFloatingStation();
    [/* game */, player] = testGame(2);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;

    player.addResourceTo(card, 7);
    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[1].cb();
    expect(player.megaCredits).to.eq(4);
  });
});
