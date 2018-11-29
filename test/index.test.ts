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
			"array", "boolean", "date", "integer",
			"nullableArray", "nullableBoolean",
			"nullableDate", "nullableInteger",
			"nullableNumber", "nullableObject",
			"nullableString", "number", "object", "string"
		],
		useCases: [
			{
				name: "array",
				data: [1, 2, 3],
				should: ["array", "nullableArray", "nullableObject", "object"]
			},
			{
				name: "Boolean (true)",
				data: true,
				should: ["boolean", "nullableBoolean"]
			},
			{
				name: "Boolean (false)",
				data: false,
				should: ["boolean", "nullableBoolean"]
			},
			{
				name: "date",
				data: new Date(),
				should: ["date", "nullableDate", "nullableObject", "object"]
			},
			{
				name: "integer",
				data: 42,
				should: ["integer", "nullableInteger", "nullableNumber", "number"]
			},
			{
				name: "number",
				data: 42.42,
				should: ["nullableNumber", "number"]
			},
			{
				name: "object",
				data: { some: 42 },
				should: ["nullableObject", "object"]
			},
			{
				name: "string",
				data: "42",
				should: ["nullableString", "string"]
			},
			{
				name: "null",
				data: null,
				should: ["nullableArray", "nullableBoolean",
					"nullableDate", "nullableInteger",
					"nullableNumber", "nullableObject",
					"nullableString"]
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
