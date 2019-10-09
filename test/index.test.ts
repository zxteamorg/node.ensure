import { assert } from "chai";

import { ensureFactory, Ensure } from "../src/index";

describe("Ensure tests", function () {
	let ensure: Ensure;
	let ensureWithCustomError: Ensure;
	beforeEach(function () {
		ensure = ensureFactory();
		ensureWithCustomError = ensureFactory((m, d) => { throw new Error(m); });
	});

	const specs = {
		s: [
			"array", "arrayBuffer", "boolean", "date", "defined", "integer",
			"number", "object", "string", "nullableArray", "nullableArrayBuffer",
			"nullableBoolean", "nullableDate", "nullableDefined",
			"nullableInteger", "nullableNumber", "nullableObject", "nullableString"
		],
		useCases: [
			{
				name: "array",
				data: [1, 2, 3],
				should: ["array", "defined", "nullableArray", "nullableDefined", "nullableObject", "object"]
			},
			{
				name: "ArrayBuffer",
				data: new ArrayBuffer(0),
				should: ["arrayBuffer", "defined", "nullableArrayBuffer", "nullableDefined", "nullableObject", "object"]
			},
			{
				name: "Boolean (true)",
				data: true,
				should: ["boolean", "defined", "nullableBoolean", "nullableDefined"]
			},
			{
				name: "Boolean (false)",
				data: false,
				should: ["boolean", "defined", "nullableBoolean", "nullableDefined"]
			},
			{
				name: "date",
				data: new Date(),
				should: ["date", "defined", "nullableDate", "nullableDefined", "nullableObject", "object"]
			},
			{
				name: "integer",
				data: 42,
				should: ["defined", "nullableDefined", "integer", "nullableInteger", "nullableNumber", "number"]
			},
			{
				name: "number",
				data: 42.42,
				should: ["defined", "nullableDefined", "nullableNumber", "number"]
			},
			{
				name: "object",
				data: { some: 42 },
				should: ["defined", "nullableDefined", "nullableObject", "object"]
			},
			{
				name: "string",
				data: "42",
				should: ["defined", "nullableDefined", "nullableString", "string"]
			},
			{
				name: "null",
				data: null,
				should: [
					"nullableArray", "nullableArrayBuffer", "nullableBoolean",
					"nullableDate", "nullableDefined", "nullableInteger",
					"nullableNumber", "nullableObject", "nullableString"
				]
			}
		]
	};

	specs.useCases.forEach(useCase => {
		useCase.should.forEach(should => {
			it(`Default Ensure ${useCase.name} should work with ${should}`, function () {
				const data = useCase.data;
				const result = (ensure as any)[should](data);
				assert.equal(data, result);
			});
			it(`Custom Ensure ${useCase.name} should work with ${should}`, function () {
				const data = useCase.data;
				const result = (ensureWithCustomError as any)[should](data);
				assert.equal(data, result);
			});
		});
		specs.s.forEach(shouldNot => {
			if (useCase.should.indexOf(shouldNot) === -1) {
				it(`Default Ensure ${useCase.name} should NOT work with ${shouldNot}`, function () {
					const data = useCase.data;
					let expectedError;
					try {
						(ensure as any)[shouldNot](data);
					} catch (e) {
						expectedError = e;
					}
					assert.isDefined(expectedError);
				});
				it(`Default Ensure ${useCase.name} should NOT work with ${shouldNot} (custom err message)`, function () {
					const data = useCase.data;
					let expectedError;
					try {
						(ensure as any)[shouldNot](data, "Custom err message");
					} catch (e) {
						expectedError = e;
					}
					assert.isDefined(expectedError);
					assert.include(expectedError.message, "Custom err message");
				});
				it(`Custom Ensure ${useCase.name} should NOT work with ${shouldNot}`, function () {
					const data = useCase.data;
					let expectedError;
					try {
						(ensureWithCustomError as any)[shouldNot](data);
					} catch (e) {
						expectedError = e;
					}
					assert.isDefined(expectedError);
				});
				it(`Custom Ensure ${useCase.name} should NOT work with ${shouldNot} (custom err message)`, function () {
					const data = useCase.data;
					let expectedError;
					try {
						(ensureWithCustomError as any)[shouldNot](data, "Custom err message");
					} catch (e) {
						expectedError = e;
					}
					assert.isDefined(expectedError);
					assert.include(expectedError.message, "Custom err message");
				});
			}
		});
	});

	it(`Ensure undefiled should NOT work defined()`, function () {
		let expectedError;
		try {
			ensure.defined(undefined);
		} catch (e) {
			expectedError = e;
		}
		assert.isDefined(expectedError);
	});
	it(`Ensure undefiled should NOT work nullableDefined()`, function () {
		let expectedError;
		try {
			ensure.nullableDefined(undefined);
		} catch (e) {
			expectedError = e;
		}
		assert.isDefined(expectedError);
	});
	it(`Ensure undefiled should NOT work defined()`, function () {
		let expectedError;
		try {
			ensureWithCustomError.defined(undefined);
		} catch (e) {
			expectedError = e;
		}
		assert.isDefined(expectedError);
	});
	it(`Ensure undefiled should NOT work nullableDefined()`, function () {
		let expectedError;
		try {
			ensureWithCustomError.nullableDefined(undefined);
		} catch (e) {
			expectedError = e;
		}
		assert.isDefined(expectedError);
	});
	it(`Ensure undefiled should NOT work defined()`, function () {
		let expectedError;
		try {
			ensure.defined(undefined, "Custom err message");
		} catch (e) {
			expectedError = e;
		}
		assert.isDefined(expectedError);
		assert.include(expectedError.message, "Custom err message");
	});
	it(`Ensure undefiled should NOT work nullableDefined()`, function () {
		let expectedError;
		try {
			ensure.nullableDefined(undefined, "Custom err message");
		} catch (e) {
			expectedError = e;
		}
		assert.isDefined(expectedError);
		assert.include(expectedError.message, "Custom err message");
	});
	it(`Ensure undefiled should NOT work defined()`, function () {
		let expectedError;
		try {
			ensure.defined(undefined, "Custom err message");
		} catch (e) {
			expectedError = e;
		}
		assert.isDefined(expectedError);
		assert.include(expectedError.message, "Custom err message");
	});
	it(`Ensure undefiled should NOT work nullableDefined()`, function () {
		let expectedError;
		try {
			ensure.nullableDefined(undefined, "Custom err message");
		} catch (e) {
			expectedError = e;
		}
		assert.isDefined(expectedError);
		assert.include(expectedError.message, "Custom err message");
	});
});
