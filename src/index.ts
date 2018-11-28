import * as _ from "lodash";

export class EnsureError extends Error {
	public readonly data: any;
	public constructor(message: string, data: any) {
		super(message);
		this.data = data;
	}
}

export interface Ensure {
	enforceArray<T>(data: Array<T>): Array<T>;
	enforceBoolean(data: boolean): boolean;
	enforceDate(data: Date): Date;
	enforceInteger(data: number): number;
	enforceNumber(data: number): number;
	enforceObject<T>(data: T): T;
	enforceString(data: string): string;

	enforceNullableArray<T>(data: Array<T> | null): Array<T> | null;
	enforceNullableBoolean(data: boolean | null): boolean | null;
	enforceNullableDate(data: Date | null): Date | null;
	enforceNullableInteger(data: number | null): number | null;
	enforceNullableNumber(data: number | null): number | null;
	enforceNullableObject<T>(data: T | null): T | null;
	enforceNullableString(data: string | null): string | null;
}

export function ensureFactory(errorFactory?: (message: string, data: any) => void): Ensure {

	function enforceType<T>(data: T, checker: (v: T) => boolean, typeMsg: string): T {
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
	function enforceNullableType<T>(data: T, checker: (v: T) => boolean, typeMsg: string): T | null {
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
		enforceArray: <T>(data: Array<T>): Array<T> => { return enforceType(data, _.isArray, "Array"); },
		enforceBoolean: (data: boolean): boolean => { return enforceType(data, _.isBoolean, "boolean"); },
		enforceDate: (data: Date): Date => { return enforceType(data, _.isDate, "Date"); },
		enforceInteger: (data: number): number => { return enforceType(data, _.isInteger, "integer"); },
		enforceNumber: (data: number): number => { return enforceType(data, _.isNumber, "number"); },
		enforceObject: <T>(data: T): T => { return enforceType(data, _.isObject, "object"); },
		enforceString: (data: string): string => { return enforceType(data, _.isString, "string"); },

		enforceNullableArray: <T>(data: Array<T> | null): Array<T> | null => { return enforceNullableType(data, _.isArray, "Array"); },
		enforceNullableBoolean: (data: boolean | null): boolean | null => { return enforceNullableType(data, _.isBoolean, "boolean"); },
		enforceNullableDate: (data: Date | null): Date | null => { return enforceNullableType(data, _.isDate, "Date"); },
		enforceNullableInteger: (data: number | null): number | null => { return enforceNullableType(data, _.isInteger, "integer"); },
		enforceNullableNumber: (data: number | null): number | null => { return enforceNullableType(data, _.isNumber, "number"); },
		enforceNullableObject: <T>(data: T | null): T | null => { return enforceNullableType(data, _.isObject, "object"); },
		enforceNullableString: (data: string | null): string | null => { return enforceNullableType(data, _.isString, "string"); }
	};
}

export default ensureFactory;
