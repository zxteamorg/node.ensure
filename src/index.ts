import * as _ from "lodash";

export class EnsureError extends Error {
	public readonly data: any;
	public constructor(message: string, data: any) {
		super(message);
		this.data = data;
	}
}

export interface Ensure {
	array<T>(data: Array<T>): Array<T>;
	boolean(data: boolean): boolean;
	date(data: Date): Date;
	integer(data: number): number;
	number(data: number): number;
	object<T>(data: T): T;
	string(data: string): string;

	nullableArray<T>(data: Array<T> | null): Array<T> | null;
	nullableBoolean(data: boolean | null): boolean | null;
	nullableDate(data: Date | null): Date | null;
	nullableInteger(data: number | null): number | null;
	nullableNumber(data: number | null): number | null;
	nullableObject<T>(data: T | null): T | null;
	nullableString(data: string | null): string | null;
}

export function ensureFactory(errorFactory?: (message: string, data: any) => void): Ensure {

	function Type<T>(data: T, checker: (v: T) => boolean, typeMsg: string): T {
		if (!checker(data)) {
			const message = `Expected data to be ${typeMsg}`;
			if (errorFactory) {
				throw errorFactory(message, data);
			} else {
				throw new EnsureError(message, data);
			}
		}
		return data;
	}
	function NullableType<T>(data: T, checker: (v: T) => boolean, typeMsg: string): T | null {
		if (data != null && !checker(data)) {
			const message = `Expected data to be ${typeMsg} or null`;
			if (errorFactory) {
				throw errorFactory(message, data);
			} else {
				throw new EnsureError(message, data);
			}
		}
		return data;
	}

	return {
		array: <T>(data: Array<T>): Array<T> => { return Type(data, _.isArray, "Array"); },
		boolean: (data: boolean): boolean => { return Type(data, _.isBoolean, "boolean"); },
		date: (data: Date): Date => { return Type(data, _.isDate, "Date"); },
		integer: (data: number): number => { return Type(data, _.isInteger, "integer"); },
		number: (data: number): number => { return Type(data, _.isNumber, "number"); },
		object: <T>(data: T): T => { return Type(data, _.isObject, "object"); },
		string: (data: string): string => { return Type(data, _.isString, "string"); },

		nullableArray: <T>(data: Array<T> | null): Array<T> | null => { return NullableType(data, _.isArray, "Array"); },
		nullableBoolean: (data: boolean | null): boolean | null => { return NullableType(data, _.isBoolean, "boolean"); },
		nullableDate: (data: Date | null): Date | null => { return NullableType(data, _.isDate, "Date"); },
		nullableInteger: (data: number | null): number | null => { return NullableType(data, _.isInteger, "integer"); },
		nullableNumber: (data: number | null): number | null => { return NullableType(data, _.isNumber, "number"); },
		nullableObject: <T>(data: T | null): T | null => { return NullableType(data, _.isObject, "object"); },
		nullableString: (data: string | null): string | null => { return NullableType(data, _.isString, "string"); }
	};
}

export default ensureFactory;
