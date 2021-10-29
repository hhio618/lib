import { HDWallet } from '@shapeshiftoss/hdwallet-core'
import {
  ApprovalNeededInput,
  ApprovalNeededOutput,
  ApproveInfiniteInput,
  Asset,
  BuildQuoteTxInput,
  ExecQuoteInput,
  ExecQuoteOutput,
  GetQuoteInput,
  MinMaxOutput,
  Quote,
  SwapperType
} from '@shapeshiftoss/types'

export class SwapError extends Error {}

interface ISwapper<S extends SwapperType = SwapperType> {
  /** Returns the swapper type */
  getType(): S

  /**
   * Get a Quote along with an unsigned transaction that can be signed and broadcast to execute the swap
   **/
  buildQuoteTx(args: BuildQuoteTxInput): Promise<Quote<SwapperType>>

  /**
   * Get a basic quote (rate) for a trading pair
   */
  getQuote(input: GetQuoteInput, wallet?: HDWallet): Promise<Quote<SwapperType>>

  /**
   * Get a list of available assets based on the array of assets you send it
   */
  getAvailableAssets(assets: Asset[]): Asset[]

  /**
   * Get a boolean if the trade pair will work
   */
  canTradePair(sellAsset: Asset, buyAsset: Asset): boolean

  /**
   * Get the usd rate from either the assets symbol or tokenId
   */
  getUsdRate(input: Pick<Asset, 'symbol' | 'tokenId'>): Promise<string>

  /**
   * Get the default pair of the swapper
   */
  getDefaultPair(): Pick<Asset, 'chain' | 'symbol' | 'name'>[]

  /**
   * Get the minimum and maximum trade value of the sellAsset and buyAsset
   */
  getMinMax(input: GetQuoteInput): Promise<MinMaxOutput>

  /**
   * Execute a quote built with buildQuoteTx by signing and broadcasting
   */
  executeQuote(args: ExecQuoteInput<SwapperType>): Promise<ExecQuoteOutput>

  /**
   * Get a boolean if a quote needs approval
   */
  approvalNeeded(args: ApprovalNeededInput<SwapperType>): Promise<ApprovalNeededOutput>

  /**
   * Get the txid of an approve infinite transaction
   */
  approveInfinite(args: ApproveInfiniteInput<SwapperType>): Promise<string>
}

export type Swapper<T extends SwapperType = SwapperType> = T extends SwapperType
  ? ISwapper<T>
  : never
