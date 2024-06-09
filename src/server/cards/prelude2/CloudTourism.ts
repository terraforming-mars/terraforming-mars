import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {ActionCard} from '../ActionCard';
import {CardResource} from '../../../common/CardResource';
import {Resource} from '../../../common/Resource';

export class CloudTourism extends ActionCard {
  constructor() {
    super({
      name: CardName.CLOUD_TOURISM,
      type: CardType.ACTIVE,
      tags: [Tag.JOVIAN, Tag.VENUS],
      cost: 11,
      victoryPoints: {resourcesHere: 1, per: 3},
      resourceType: CardResource.FLOATER,

      action: {
        addResources: 1,
      },

      metadata: {
        cardNumber: '',
        description: 'Increase your M€ production 1 step for each pair of Earth and Venus tags you own. 1 VP for every 3rd floater on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.FLOATER);
          }).br;
          b.production((pb) => {
            pb.megacredits(1).slash().tag(Tag.EARTH).tag(Tag.VENUS);
          });
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    // This does its own calculation because player.tags isn't robust enough at the moment
    const counts = {
      earth: player.tags.count(Tag.EARTH, 'raw'),
      // The +1 is "including this"
      venus: player.tags.count(Tag.VENUS, 'raw') + 1,
    };
    if (player.cardIsInEffect(CardName.EARTH_EMBASSY)) {
      counts.earth += player.tags.count(Tag.MOON, 'raw');
    }
    let wildTags = player.tags.count(Tag.WILD, 'raw');
    while (wildTags > 0) {
      if (counts.earth < counts.venus) {
        counts.earth++;
      } else {
        counts.venus++;
      }
      wildTags--;
    }
    const production = Math.min(counts.earth, counts.venus);
    player.production.add(Resource.MEGACREDITS, production, {log: true});
    return undefined;
  }
}
