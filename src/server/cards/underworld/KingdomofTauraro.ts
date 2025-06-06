import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {all} from '../Options';
import {Resource} from '../../../common/Resource';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class KingdomofTauraro extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.KINGDOM_OF_TAURARO,
      tags: [Tag.MARS],
      startingMegaCredits: 50,
      victoryPoints: -2,

      behavior: {
        production: {megacredits: 6},
      },

      firstAction: {
        text: 'Place a city.',
        city: {},
      },

      metadata: {
        cardNumber: 'UC06',
        description: 'You start with 50 M€ and 6 M€ production. All opponents gain 2 M€ production. As your first action, place a city.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(50).production((pb) => pb.megacredits(6)).production((pb) => pb.megacredits(2, {all})).city().br;
          b.plainText('(Effect: You may place cities adjacent to other cities. You must always place cities adjacent to tiles you already own, if possible.)');
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    for (const opponent of player.getOpponents()) {
      opponent.production.add(Resource.MEGACREDITS, 2, {log: true});
    }
    return undefined;
  }
}

