/*
  Used to describe any distinct symbol on a card and prepare it for rendering in Vue
  e.g. plus and minus sign, asterix, arrow, dash, slash, etc.
 */
import {CardRenderSymbolType} from '../../../common/cards/render/CardRenderSymbolType';
import {ICardRenderSymbol} from '../../../common/cards/render/Types';
import {Size} from '../../../common/cards/render/Size';

export class CardRenderSymbol implements ICardRenderSymbol {
  public readonly is = 'symbol';

  private constructor(public type: CardRenderSymbolType, public size: Size, public isIcon: boolean = false) {}

  public static asterix(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.ASTERIX, size);
  }
  public static or(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.OR, size);
  }
  public static plus(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.PLUS, size, true);
  }
  public static minus(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.MINUS, size, true);
  }
  public static empty(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.EMPTY, size);
  }
  public static slash(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.SLASH, size);
  }
  public static colon(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.COLON, size);
  }
  public static arrow(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.ARROW, size, true);
  }
  public static bracketOpen(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.BRACKET_OPEN, size);
  }
  public static bracketClose(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.BRACKET_CLOSE, size);
  }
  public static nbsp(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.NBSP, size, true);
  }
  public static vSpace(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.VSPACE, size, true);
  }
  public static equals(size: Size = Size.MEDIUM): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.EQUALS, size);
  }
  public static surveyMission(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.SURVEY_MISSION, Size.MEDIUM, true);
  }
}
