import {expect} from 'chai';
import {DeuteriumExport} from '../../../src/server/cards/venusNext/DeuteriumExport';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, churn} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('DeuteriumExport', () => {
  let card: DeuteriumExport;
  let player: TestPlayer;

  beforeEach(() => {
    card = new DeuteriumExport();
    [/* game */, player] = testGame(1, {preludeExtension: true});
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    expect(churn(card.action(player), player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast(churn(card.action(player), player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.production.energy).to.eq(1);
  });
});
