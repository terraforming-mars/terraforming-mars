import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../../src/cards/base/ColonizerTrainingCamp';
import {ICard} from '../../../src/cards/ICard';
import {DeuteriumExport} from '../../../src/cards/venusNext/DeuteriumExport';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {HydrogenToVenus} from '../../../src/cards/venusNext/HydrogenToVenus';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('HydrogenToVenus', function() {
  let card : HydrogenToVenus; let player : Player; let game : Game;

  beforeEach(function() {
    card = new HydrogenToVenus();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play with multiple venus cards', function() {
    const card2 = new DeuteriumExport();
    const card3 = new ColonizerTrainingCamp();
    const card4 = new Dirigibles();
    player.playedCards.push(card2, card3, card4);

    const action = card.play(player) as SelectCard<ICard>;
    expect(action).instanceOf(SelectCard);
    action.cb([card2]);
    expect(card2.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play with single venus card', function() {
    const card = new HydrogenToVenus();
    const card2 = new DeuteriumExport();
    const card3 = new ColonizerTrainingCamp();
    player.playedCards.push(card2, card3);

        card.play(player) as SelectCard<ICard>;
        expect(card2.resourceCount).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play with no venus cards', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
