import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game, GameOptions} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {Tags} from '../../../src/cards/Tags';
import {NitrateReducers} from '../../../src/cards/community/NitrateReducers';
import {Resources} from '../../../src/Resources';

describe('NitrateReducers', function() {
  let card : NitrateReducers; let player : Player; let game : Game;

  beforeEach(function() {
    card = new NitrateReducers();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions() as GameOptions;
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player, game);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    expect(player.cardsInHand).has.lengthOf(2);

    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tags.MICROBES)).not.to.eq(-1));
  });
});
