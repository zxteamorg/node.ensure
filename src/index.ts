const { name: packageName, version: packageVersion } = require("../package.json");
const G: any = global || window || {};
const PACKAGE_GUARD: symbol = Symbol.for(packageName);
/* istanbul ignore next */
if (PACKAGE_GUARD in G) {
	const conflictVersion = G[PACKAGE_GUARD];
	// tslint:disable-next-line: max-line-length
	const msg = `Conflict module version. Looks like two different version of package ${packageName} was loaded inside the process: ${conflictVersion} and ${packageVersion}.`;
	if (process !== undefined && process.env !== undefined && process.env.NODE_ALLOW_CONFLICT_MODULES === "1") {
		console.warn(msg + " This treats as warning because NODE_ALLOW_CONFLICT_MODULES is set.");
	} else {
		throw new Error(msg + " Use NODE_ALLOW_CONFLICT_MODULES=\"1\" to treats this error as warning.");
	}
} else {
	G[PACKAGE_GUARD] = packageVersion;
}

import * as _ from "lodash";

export class EnsureError extends Error {
	public readonly data: any;
	public constructor(message: string, data: any) {
		super(message);
		this.data = data;
	}
}

export interface Ensure {
	array<T = any>(data: Array<T>, errorMessage?: string): Array<T>;
	arrayBuffer(data: ArrayBuffer, errorMessage?: string): ArrayBuffer;
	boolean(data: boolean, errorMessage?: string): boolean;
	date(data: Date, errorMessage?: string): Date;
	defined<T = any>(data: T | null | undefined, errorMessage?: string): T;
	integer(data: number, errorMessage?: string): number;
	number(data: number, errorMessage?: string): number;
	object<T = any>(data: T, errorMessage?: string): T;
	string(data: string, errorMessage?: string): string;
	undefined(data: any, errorMessage?: string): undefined;
	nullableArray<T>(data: Array<T> | null, errorMessage?: string): Array<T> | null;
	nullableArrayBuffer(data: ArrayBuffer | null, errorMessage?: string): ArrayBuffer | null;
	nullableBoolean(data: boolean | null, errorMessage?: string): boolean | null;
	nullableDate(data: Date | null, errorMessage?: string): Date | null;
	nullableDefined<T>(data: T | null | undefined, errorMessage?: string): T | null;
	nullableInteger(data: number | null, errorMessage?: string): number | null;
	nullableNumber(data: number | null, errorMessage?: string): number | null;
	nullableObject<T = any>(data: T | null, errorMessage?: string): T | null;
	nullableString(data: string | null, errorMessage?: string): string | null;
}

export function ensureFactory(errorFactory?: (message: string, data: any) => never): Ensure {

	function throwEnsureError(typeMsg: string, throwData: any, userErrorMessage?: string): never {
		const errorMessage = `Expected data to be "${typeMsg}".`;
		const message = userErrorMessage !== undefined ? `${userErrorMessage} ${errorMessage}` : errorMessage;
		if (errorFactory !== undefined) {
			errorFactory(message, throwData); // throws an user's error
		}

		throw new EnsureError(message, throwData);
	}
	function Type<T>(data: T, checker: (v: T) => boolean, typeMsg: string, userErrorMessage?: string): T {
		if (!checker(data)) {
			throwEnsureError(typeMsg, data, userErrorMessage);
		}
		return data;
	}
	function NullableType<T>(data: T, checker: (v: T) => boolean, typeMsg: string, userErrorMessage?: string): T | null {
		if (data === undefined || (data !== null && !checker(data))) {
			throwEnsureError(typeMsg, data, userErrorMessage);
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
		integer: (data: number, errorMessage?: string): number => {
			return Type(data, _.isInteger, "integer", errorMessage);
		},
		number: (data: number, errorMessage?: string): number => {
			return Type(data, _.isNumber, "number", errorMessage);
		},
		object: <T = any>(data: T, errorMessage?: string): T => {
			return Type(data, _.isObjectLike, "object", errorMessage);
		},
		string: (data: string, errorMessage?: string): string => {
			return Type(data, _.isString, "string", errorMessage);
		},
		undefined: (data: any, errorMessage?: string): undefined => {
			if (data !== undefined) {
				const message = errorMessage !== undefined ? errorMessage : "Expected data to be undefined";
				if (errorFactory !== undefined) {
					errorFactory(message, data); // throws an user's error
				}
				throw new EnsureError(message, data);
			}
			return data;
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
		nullableInteger: (data: number | null, errorMessage?: string): number | null => {
			return NullableType(data, _.isInteger, "integer", errorMessage);
		},
		nullableNumber: (data: number | null, errorMessage?: string): number | null => {
			return NullableType(data, _.isNumber, "number", errorMessage);
		},
		nullableObject: <T = any>(data: T | null, errorMessage?: string): T | null => {
			return NullableType(data, _.isObjectLike, "object", errorMessage);
		},
		nullableString: (data: string | null, errorMessage?: string): string | null => {
			return NullableType(data, _.isString, "string", errorMessage);
		}
	};
}

export default ensureFactory;
