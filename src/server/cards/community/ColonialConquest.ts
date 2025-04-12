import { CardName } from "../../../common/cards/CardName";
import { CardType } from "../../../common/cards/CardType";
import { Size } from "../../../common/cards/render/Size";
import { Tag } from "../../../common/cards/Tag";
import { Card } from "../Card";
import { IProjectCard } from "../IProjectCard";
import { CardRenderer } from "../render/CardRenderer";
import { Resource } from "../../../common/Resource";
import { BuildColony } from "../../../server/deferredActions/BuildColony";
import { IPlayer } from "../../../server/IPlayer";

export class ColonialConquest extends Card implements IProjectCard {
    constructor() {
      super({
        cost: 10,
        tags: [Tag.SPACE],
        name: CardName.COLONIAL_CONQUEST,
        type: CardType.ACTIVE,
  
        behavior: {
          colonies: {
            tradeOffset: -1,
          },
        },
  
        metadata: {
          cardNumber: 'MI1',
          renderData: CardRenderer.builder((b) => {
            b.effect('When you trade, decrease trade step by one.', (eb) => {
              eb.trade().startEffect.text('-1', Size.LARGE);
            }).br;
            b.colonies(2);
          }),
          description: 'Place two colonies. The second one can be placed to colonies where you already have a colony',
        },
      });
    }
    public override bespokeCanPlay(player: IPlayer) {
        return true;
      }
    
      public override bespokePlay(player: IPlayer) {
        player.game.defer(new BuildColony(player, {title: 'Select where to build the first colony'}));
        player.game.defer(new BuildColony(player, {title: 'Select where to build the second colony', allowDuplicate: true}));
        return undefined;
      }
  }
  