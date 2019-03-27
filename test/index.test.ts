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
			"array", "arrayBuffer", "boolean", "date", "integer", "number", "object", "string",
			"nullableArray", "nullableArrayBuffer", "nullableBoolean", "nullableDate",
			"nullableInteger", "nullableNumber", "nullableObject", "nullableString"
		],
		useCases: [
			{
				name: "array",
				data: [1, 2, 3],
				should: ["array", "nullableArray", "nullableObject", "object"],
				is: ["isArray", "isObject"]
			},
			{
				name: "ArrayBuffer",
				data: new ArrayBuffer(0),
				should: ["arrayBuffer", "nullableArrayBuffer", "nullableObject", "object"],
				is: ["isArrayBuffer", "isObject"]
			},
			{
				name: "Boolean (true)",
				data: true,
				should: ["boolean", "nullableBoolean"],
				is: ["isBoolean"]
			},
			{
				name: "Boolean (false)",
				data: false,
				should: ["boolean", "nullableBoolean"],
				is: ["isBoolean"]
			},
			{
				name: "date",
				data: new Date(),
				should: ["date", "nullableDate", "nullableObject", "object"],
				is: ["isDate", "isObject"]
			},
			{
				name: "integer",
				data: 42,
				should: ["integer", "nullableInteger", "nullableNumber", "number"],
				is: ["isInteger", "isNumber"]
			},
			{
				name: "number",
				data: 42.42,
				should: ["nullableNumber", "number"],
				is: ["isNumber"]
			},
			{
				name: "object",
				data: { some: 42 },
				should: ["nullableObject", "object"],
				is: ["isObject"]
			},
			{
				name: "string",
				data: "42",
				should: ["nullableString", "string"],
				is: ["isString"]
			},
			{
				name: "null",
				data: null,
				should: ["nullableArray", "nullableArrayBuffer", "nullableBoolean",
					"nullableDate", "nullableInteger",
					"nullableNumber", "nullableObject",
					"nullableString"],
				is: []
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
		useCase.is.forEach(is => {
			it(`Default Ensure ${useCase.name} should work with ${is}`, function () {
				const data = useCase.data;
				const result = (ensure as any)[is](data);
				assert.isTrue(result);
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
			}
		});
	});
});
