/*
  Used to describe any distinct symbol on a card and prepare it for rendering in Vue
  e.g. plus and minus sign, asterix, arrow, dash, slash, etc.
 */
import {CardRenderSymbolType} from '../../../common/cards/render/CardRenderSymbolType';
import {ICardRenderSymbol} from '../../../common/cards/render/Types';
import {Size} from '../../../common/cards/render/Size';

export class CardRenderSymbol implements ICardRenderSymbol {
  public readonly is = 'symbol';
  public readonly type: CardRenderSymbolType;
  public readonly size: Size;
  public readonly isIcon: boolean;
  public readonly isSuperscript: boolean;

  private constructor(type: CardRenderSymbolType, options: {size?: Size, isIcon?: boolean, isSuperscript?: boolean}) {
    this.type = type;
    this.size = options.size ?? Size.MEDIUM;
    this.isIcon = options.isIcon ?? false;
    this.isSuperscript = options.isSuperscript ?? false;
  }

  public static asterix(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.ASTERIX, {size});
  }
  public static or(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.OR, {size});
  }
  public static plus(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.PLUS, {size, isIcon: true});
  }
  public static minus(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.MINUS, {size, isIcon: true});
  }
  public static empty(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.EMPTY, {size});
  }
  public static slash(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.SLASH, {size});
  }
  public static colon(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.COLON, {size});
  }
  public static arrow(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.ARROW, {size, isIcon: true});
  }
  public static bracketOpen(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.BRACKET_OPEN, {isSuperscript: true});
  }
  public static bracketClose(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.BRACKET_CLOSE, {isSuperscript: true});
  }
  public static nbsp(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.NBSP, {size, isIcon: true});
  }
  public static vSpace(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.VSPACE, {size, isIcon: true});
  }
  public static equals(size?: Size): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.EQUALS, {size});
  }
  public static surveyMission(): CardRenderSymbol {
    return new CardRenderSymbol(CardRenderSymbolType.SURVEY_MISSION, {isIcon: true});
  }
}
