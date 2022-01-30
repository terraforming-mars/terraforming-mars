import {expect} from 'chai';
import {DeuteriumExport} from '../../../src/cards/venusNext/DeuteriumExport';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('DeuteriumExport', function() {
  let card : DeuteriumExport; let player : Player;

  beforeEach(function() {
    card = new DeuteriumExport();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);

    const orOptions = card.action(player) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
        orOptions!.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
