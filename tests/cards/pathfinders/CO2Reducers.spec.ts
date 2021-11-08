import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CO2Reducers} from '../../../src/cards/pathfinders/CO2Reducers';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/Units';
import {Tags} from '../../../src/cards/Tags';
import {TestPlayer} from '../../TestPlayer';

describe('CO2Reducers', function() {
  let card: CO2Reducers;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CO2Reducers();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 3}));

    expect(player.cardsInHand).has.lengthOf(2);
    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tags.MICROBE)).not.to.eq(-1));
  });
});
