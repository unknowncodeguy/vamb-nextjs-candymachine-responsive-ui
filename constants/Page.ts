import { Color } from "@material-ui/core"
import { blue, orange, pink, red, teal } from "@material-ui/core/colors"
import { SvgIconProps } from "@material-ui/core/SvgIcon"
import { Home, Info, Save, Whatshot } from "@material-ui/icons"
import { IEnum } from "."

/**
 * Page constants
 * @author tree
 */
export class Page implements IEnum<Page> {
  /**
   * For values() array
   */
  private static _values = new Array<Page>()

  public static readonly MINT = new Page(
    1,
    "MINT",
    "/mint",
    Home,
    pink
  )
  public static readonly GUIDE = new Page(
    2,
    "GUIDE",
    "/guide",
    Save,
    blue
  )
  public static readonly SETTINGS = new Page(
    3,
    "SETTINGS",
    "/settings",
    Whatshot,
    teal
  )
  public static readonly MARKET = new Page(
    10,
    "MARKET",
    "/market",
    Info,
    orange
  )

  /**
   * constructor
   * @param number page id
   * @param pageTitle page title
   * @param pageDescription page description
   * @param title seo title
   * @param metaDescription seo meta description
   * @param relativeUrl relative url
   * @param icon page icon
   * @param iconColor page icon color
   */
  private constructor(
    public readonly id: number,
    public readonly pageTitle: string,
    public readonly relativeUrl: string,
    public readonly icon: React.ComponentType<SvgIconProps>,
    public readonly iconColor: Color
  ) {
    Page._values.push(this)
  }

  /**
   * Instance array
   */
  static get values(): Page[] {
    return this._values
  }

  /**
   * @inheritdoc
   */
  equals = (target: Page): boolean => this.id === target.id

  /**
   * @inheritdoc
   */
  toString = (): string =>
    `${this.id}, ${this.pageTitle}`
}
