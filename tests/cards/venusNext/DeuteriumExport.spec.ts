import {expect} from 'chai';
import {DeuteriumExport} from '../../../src/server/cards/venusNext/DeuteriumExport';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('DeuteriumExport', function() {
  let card: DeuteriumExport;
  let player: Player;

  beforeEach(function() {
    card = new DeuteriumExport();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.production.energy).to.eq(1);
  });
});
