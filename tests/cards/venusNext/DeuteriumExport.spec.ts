import {expect} from 'chai';
import {DeuteriumExport} from '../../../src/server/cards/venusNext/DeuteriumExport';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, churnAction} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('DeuteriumExport', function() {
  let card: DeuteriumExport;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DeuteriumExport();
    [/* skipped */, player] = testGame(1, {preludeExtension: true});
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(churnAction(card, player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast(churnAction(card, player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.production.energy).to.eq(1);
  });
});
