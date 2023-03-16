import {expect} from 'chai';
import {DeuteriumExport} from '../../../src/server/cards/venusNext/DeuteriumExport';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('DeuteriumExport', function() {
  let card: DeuteriumExport;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DeuteriumExport();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.popSelectInitialCards();
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(player.game);
    expect(player.popWaitingFor()).is.undefined;
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    runAllActions(player.game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.production.energy).to.eq(1);
  });
});
