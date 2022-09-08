import {expect} from 'chai';
import {newTestGame, TestGame} from '../../TestGame';
import {CO2Reducers} from '../../../src/server/cards/pathfinders/CO2Reducers';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';

describe('CO2Reducers', function() {
  let card: CO2Reducers;
  let player: TestPlayer;
  let game: TestGame;

  beforeEach(function() {
    card = new CO2Reducers();
    game = newTestGame(1);
    player = game.testPlayers[0];
  });

  it('Should play', function() {
    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3}));

    expect(player.cardsInHand).has.lengthOf(2);
    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.MICROBE)).not.to.eq(-1));
  });
});
