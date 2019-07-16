import { Financial } from "@zxteam/contract";
import * as _ from "lodash";

export class EnsureError extends Error {
	public readonly data: any;
	public constructor(message: string, data: any) {
		super(message);
		this.data = data;
	}
}

export interface Ensure {
	array<T>(data: Array<T>, errorMessage?: string): Array<T>;
	arrayBuffer(data: ArrayBuffer, errorMessage?: string): ArrayBuffer;
	boolean(data: boolean, errorMessage?: string): boolean;
	date(data: Date, errorMessage?: string): Date;
	defined<T>(data: T | null | undefined, errorMessage?: string): T;
	financial(data: Financial, errorMessage?: string): Financial;
	integer(data: number, errorMessage?: string): number;
	number(data: number, errorMessage?: string): number;
	object(data: Object, errorMessage?: string): Object;
	string(data: string, errorMessage?: string): string;

	nullableArray<T>(data: Array<T> | null, errorMessage?: string): Array<T> | null;
	nullableArrayBuffer(data: ArrayBuffer | null, errorMessage?: string): ArrayBuffer | null;
	nullableBoolean(data: boolean | null, errorMessage?: string): boolean | null;
	nullableDate(data: Date | null, errorMessage?: string): Date | null;
	nullableDefined<T>(data: T | null | undefined, errorMessage?: string): T | null;
	nullableFinancial(data: Financial | null, errorMessage?: string): Financial | null;
	nullableInteger(data: number | null, errorMessage?: string): number | null;
	nullableNumber(data: number | null, errorMessage?: string): number | null;
	nullableObject(data: Object | null, errorMessage?: string): Object | null;
	nullableString(data: string | null, errorMessage?: string): string | null;

}

export function ensureFactory(errorFactory?: (message: string, data: any) => never): Ensure {

	function Type<T>(data: T, checker: (v: T) => boolean, typeMsg: string, userErrorMessage?: string): T {
		if (!checker(data)) {
			const message = userErrorMessage !== undefined ? userErrorMessage : `Expected data to be ${typeMsg}`;
			if (errorFactory !== undefined) {
				errorFactory(message, data); // throws an user's error
			}

			throw new EnsureError(message, data);
		}
		return data;
	}
	function NullableType<T>(data: T, checker: (v: T) => boolean, typeMsg: string, userErrorMessage?: string): T | null {
		if (data != null && !checker(data)) {
			const message = userErrorMessage !== undefined ? userErrorMessage : `Expected data to be ${typeMsg} or null`;
			if (errorFactory !== undefined) {
				throw errorFactory(message, data); // throws an user's error
			}

			throw new EnsureError(message, data);
		}
		return data;
	}

	return {
		array: <T>(data: Array<T>, errorMessage?: string): Array<T> => {
			return Type(data, _.isArray, "Array", errorMessage);
		},
		arrayBuffer: (data: ArrayBuffer, errorMessage?: string): ArrayBuffer => {
			return Type(data, _.isArrayBuffer, "ArrayBuffer", errorMessage);
		},
		boolean: (data: boolean, errorMessage?: string): boolean => {
			return Type(data, _.isBoolean, "boolean", errorMessage);
		},
		date: (data: Date, errorMessage?: string): Date => {
			return Type(data, _.isDate, "Date", errorMessage);
		},
		defined: <T>(data: T | null | undefined, errorMessage?: string): T => {
			if (data === undefined || data === null) {
				const message = errorMessage !== undefined ? errorMessage : "Expected data to be defined";
				if (errorFactory !== undefined) {
					errorFactory(message, data); // throws an user's error
				}
				throw new EnsureError(message, data);
			}
			return data;
		},
		financial: (data: Financial, errorMessage?: string): Financial => {
			if (
				!(
					_.isObject(data) &&
					(data.sign === "+" || data.sign === "-") &&
					_.isString(data.whole) &&
					_.isString(data.fractional)
				)
			) {
				const message = errorMessage !== undefined ? errorMessage : "Expected data to be Financial";
				if (errorFactory !== undefined) {
					errorFactory(message, data); // throws an user's error
				}

				throw new EnsureError(message, data);
			}
			return data;
		},
		integer: (data: number, errorMessage?: string): number => {
			return Type(data, _.isInteger, "integer", errorMessage);
		},
		number: (data: number, errorMessage?: string): number => {
			return Type(data, _.isNumber, "number", errorMessage);
		},
		object: (data: Object, errorMessage?: string): Object => {
			return Type(data, _.isObject, "object", errorMessage);
		},
		string: (data: string, errorMessage?: string): string => {
			return Type(data, _.isString, "string", errorMessage);
		},

		nullableArray: <T>(data: Array<T> | null, errorMessage?: string): Array<T> | null => {
			return NullableType(data, _.isArray, "Array", errorMessage);
		},
		nullableArrayBuffer: (data: ArrayBuffer | null, errorMessage?: string): ArrayBuffer | null => {
			return NullableType(data, _.isArrayBuffer, "ArrayBuffer", errorMessage);
		},
		nullableBoolean: (data: boolean | null, errorMessage?: string): boolean | null => {
			return NullableType(data, _.isBoolean, "boolean", errorMessage);
		},
		nullableDate: (data: Date | null, errorMessage?: string): Date | null => {
			return NullableType(data, _.isDate, "Date", errorMessage);
		},
		nullableDefined: <T>(data?: T | null, errorMessage?: string): T | null => {
			if (data === undefined) {
				const message = errorMessage !== undefined ? errorMessage : "Expected data to be defined";
				if (errorFactory !== undefined) {
					errorFactory(message, data); // throws an user's error
				}
				throw new EnsureError(message, data);
			}
			return data;
		},
		nullableFinancial: (data: Financial | null, errorMessage?: string): Financial | null => {
			if (
				data !== null &&
				!(
					_.isObject(data) &&
					(data.sign === "+" || data.sign === "-") &&
					_.isString(data.whole) &&
					_.isString(data.fractional)
				)
			) {
				const message = errorMessage !== undefined ? errorMessage : "Expected data to be Financial or null";
				if (errorFactory !== undefined) {
					errorFactory(message, data); // throws an user's error
				}

				throw new EnsureError(message, data);
			}
			return data;
		},
		nullableInteger: (data: number | null, errorMessage?: string): number | null => {
			return NullableType(data, _.isInteger, "integer", errorMessage);
		},
		nullableNumber: (data: number | null, errorMessage?: string): number | null => {
			return NullableType(data, _.isNumber, "number", errorMessage);
		},
		nullableObject: <T>(data: T | null, errorMessage?: string): T | null => {
			return NullableType(data, _.isObject, "object", errorMessage);
		},
		nullableString: (data: string | null, errorMessage?: string): string | null => {
			return NullableType(data, _.isString, "string", errorMessage);
		}
	};
}

export default ensureFactory;
