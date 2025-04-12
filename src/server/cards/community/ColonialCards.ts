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

export class ColonialCards extends Card implements IProjectCard {
    constructor() {
      super({
        cost: 10,
        tags: [Tag.SPACE],
        name: CardName.COLONIAL_CARDS,
        type: CardType.AUTOMATED,
  
        metadata: {
          cardNumber: 'MI2',
          renderData: CardRenderer.builder((b) => {
              b.cards(1).slash().colonies(1, {size: Size.SMALL, all: false});
          }),
          description: 'Draw cards equal to your colony count',
        },
      });
    }
    public override bespokePlay(player: IPlayer) {
        let coloniesCount = 0;
        player.game.colonies.forEach((colony) => {
            colony.colonies.forEach(e => {
                if (player.id === e) {
                    coloniesCount += 1;
                }
            })
        });
        player.drawCard(coloniesCount);
        return undefined;
      }
  }
  