import * as _ from "lodash";

export class EnsureError extends Error {
	public readonly data: any;
	public constructor(message: string, data: any) {
		super(message);
		this.data = data;
	}
}

export interface Ensure {
	demandArray<T>(data: Array<T>): Array<T>;
	demandBoolean(data: boolean): boolean;
	demandDate(data: Date): Date;
	demandInteger(data: number): number;
	demandNumber(data: number): number;
	demandObject<T>(data: T): T;
	demandString(data: string): string;

	demandNullableArray<T>(data: Array<T> | null): Array<T> | null;
	demandNullableBoolean(data: boolean | null): boolean | null;
	demandNullableDate(data: Date | null): Date | null;
	demandNullableInteger(data: number | null): number | null;
	demandNullableNumber(data: number | null): number | null;
	demandNullableObject<T>(data: T | null): T | null;
	demandNullableString(data: string | null): string | null;
}

export function ensureFactory(errorFactory?: (message: string, data: any) => void): Ensure {

	function demandType<T>(data: T, checker: (v: T) => boolean, typeMsg: string): T {
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
	function demandNullableType<T>(data: T, checker: (v: T) => boolean, typeMsg: string): T | null {
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
		demandArray: <T>(data: Array<T>): Array<T> => { return demandType(data, _.isArray, "Array"); },
		demandBoolean: (data: boolean): boolean => { return demandType(data, _.isBoolean, "boolean"); },
		demandDate: (data: Date): Date => { return demandType(data, _.isDate, "Date"); },
		demandInteger: (data: number): number => { return demandType(data, _.isInteger, "integer"); },
		demandNumber: (data: number): number => { return demandType(data, _.isNumber, "number"); },
		demandObject: <T>(data: T): T => { return demandType(data, _.isObject, "object"); },
		demandString: (data: string): string => { return demandType(data, _.isString, "string"); },

		demandNullableArray: <T>(data: Array<T> | null): Array<T> | null => { return demandNullableType(data, _.isArray, "Array"); },
		demandNullableBoolean: (data: boolean | null): boolean | null => { return demandNullableType(data, _.isBoolean, "boolean"); },
		demandNullableDate: (data: Date | null): Date | null => { return demandNullableType(data, _.isDate, "Date"); },
		demandNullableInteger: (data: number | null): number | null => { return demandNullableType(data, _.isInteger, "integer"); },
		demandNullableNumber: (data: number | null): number | null => { return demandNullableType(data, _.isNumber, "number"); },
		demandNullableObject: <T>(data: T | null): T | null => { return demandNullableType(data, _.isObject, "object"); },
		demandNullableString: (data: string | null): string | null => { return demandNullableType(data, _.isString, "string"); }
	};
}

export default ensureFactory;
