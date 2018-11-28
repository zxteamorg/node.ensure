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
		enforces: [
			"enforceArray", "enforceBoolean", "enforceDate", "enforceInteger",
			"enforceNullableArray", "enforceNullableBoolean",
			"enforceNullableDate", "enforceNullableInteger",
			"enforceNullableNumber", "enforceNullableObject",
			"enforceNullableString", "enforceNumber", "enforceObject", "enforceString"
		],
		useCases: [
			{
				name: "Array",
				data: [1, 2, 3],
				should: ["enforceArray", "enforceNullableArray", "enforceNullableObject", "enforceObject"]
			},
			{
				name: "Boolean (true)",
				data: true,
				should: ["enforceBoolean", "enforceNullableBoolean"]
			},
			{
				name: "Boolean (false)",
				data: false,
				should: ["enforceBoolean", "enforceNullableBoolean"]
			},
			{
				name: "Date",
				data: new Date(),
				should: ["enforceDate", "enforceNullableDate", "enforceNullableObject", "enforceObject"]
			},
			{
				name: "Integer",
				data: 42,
				should: ["enforceInteger", "enforceNullableInteger", "enforceNullableNumber", "enforceNumber"]
			},
			{
				name: "Number",
				data: 42.42,
				should: ["enforceNullableNumber", "enforceNumber"]
			},
			{
				name: "Object",
				data: { some: 42 },
				should: ["enforceNullableObject", "enforceObject"]
			},
			{
				name: "String",
				data: "42",
				should: ["enforceNullableString", "enforceString"]
			},
			{
				name: "null",
				data: null,
				should: ["enforceNullableArray", "enforceNullableBoolean",
					"enforceNullableDate", "enforceNullableInteger",
					"enforceNullableNumber", "enforceNullableObject",
					"enforceNullableString"]
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
		specs.enforces.forEach(shouldNot => {
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
