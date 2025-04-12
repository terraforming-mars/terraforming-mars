import { CardName } from "../../../common/cards/CardName";
import { CardType } from "../../../common/cards/CardType";
import { AltSecondaryTag } from "../../../common/cards/render/AltSecondaryTag";
import { Size } from "../../../common/cards/render/Size";
import { Tag } from "../../../common/cards/Tag";
import { SelectPaymentDeferred } from "../../../server/deferredActions/SelectPaymentDeferred";
import { OrOptions } from "../../../server/inputs/OrOptions";
import { SelectOption } from "../../../server/inputs/SelectOption";
import { TITLES } from "../../../server/inputs/titles";
import { IPlayer } from "../../../server/IPlayer";
import { message } from "../../../server/logs/MessageBuilder";
import { MultiSet } from "mnemonist";
import { CeoCard } from "../ceos/CeoCard";
import { IProjectCard } from "../IProjectCard";
import { CardRenderer } from "../render/CardRenderer";
import { TileType } from "../../../common/TileType";
import { Resource } from "../../../common/Resource";
import { Board } from "../../../server/boards/Board";
import { Space } from "../../../server/boards/Space";
import { GainResources } from "../../../server/deferredActions/GainResources";
import { Priority } from "../../../server/deferredActions/Priority";

export class RootWhisperer extends CeoCard {
    constructor() {
      super({
        name: CardName.ROOT_WHISPERER,
        metadata: {
          cardNumber: 'MI9',
          renderData: CardRenderer.builder((b) => {
            b.br;
            b.cards(1).slash().greenery();
            b.br.br;
          }),
          description: 'When you place a greenery tile, draw a card',
        },
      });
    }
  
    public override canAct(): boolean {
      return false;
    }
  
    public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
        if (Board.isGreenerySpace(space) && activePlayer === cardOwner) {
          cardOwner.drawCard(1);
        }
      }
  }
  