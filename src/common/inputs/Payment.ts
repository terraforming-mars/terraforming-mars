import { CardResource } from "../CardResource";
import { Resource } from "../Resource";

/**
 * "PaymentOptions" tells the client what options they have for any given payment input.
 * 
 * The key of each entry in the record is the name of unique spendable resource.
 * 
 * "value" tells the client how much any given resource is worth, so the client knows how much MC they are spending.
 * 
 * "resource" simply tells the client what resource to render next to the payment input.
 * 
 * "maxSpendable" tells the client they can't input more than the specified amount.
 */
export type PaymentOptions = Record<string, { value: number, resource: string, maxSpendable: number }>;

/**
 * "Payment" is how the client responds to a payment input.
 * 
 * Each entry says how much of each resource the client decided to spend.
 * 
 * Each entry in the record should have matching keys to the corresponding "PaymentOptions" of the input.
 */
export type Payment = Record<string, number>;

/**
 * "ReserveUnits" is how the player knows to adjust the "maxSpendable" according to project cards that make you lose resources 
 */
export type ReserveUnits = {[key in Resource | CardResource]?: number};