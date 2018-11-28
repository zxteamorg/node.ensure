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
		demands: [
			"demandArray", "demandBoolean", "demandDate", "demandInteger",
			"demandNullableArray", "demandNullableBoolean",
			"demandNullableDate", "demandNullableInteger",
			"demandNullableNumber", "demandNullableObject",
			"demandNullableString", "demandNumber", "demandObject", "demandString"
		],
		useCases: [
			{
				name: "Array",
				data: [1, 2, 3],
				should: ["demandArray", "demandNullableArray", "demandNullableObject", "demandObject"]
			},
			{
				name: "Boolean (true)",
				data: true,
				should: ["demandBoolean", "demandNullableBoolean"]
			},
			{
				name: "Boolean (false)",
				data: false,
				should: ["demandBoolean", "demandNullableBoolean"]
			},
			{
				name: "Date",
				data: new Date(),
				should: ["demandDate", "demandNullableDate", "demandNullableObject", "demandObject"]
			},
			{
				name: "Integer",
				data: 42,
				should: ["demandInteger", "demandNullableInteger", "demandNullableNumber", "demandNumber"]
			},
			{
				name: "Number",
				data: 42.42,
				should: ["demandNullableNumber", "demandNumber"]
			},
			{
				name: "Object",
				data: { some: 42 },
				should: ["demandNullableObject", "demandObject"]
			},
			{
				name: "String",
				data: "42",
				should: ["demandNullableString", "demandString"]
			},
			{
				name: "null",
				data: null,
				should: ["demandNullableArray", "demandNullableBoolean",
					"demandNullableDate", "demandNullableInteger",
					"demandNullableNumber", "demandNullableObject",
					"demandNullableString"]
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
		specs.demands.forEach(shouldNot => {
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

	// it("Array", function () {
	// 	const data: any = [1, 2, 3];

	// 	assert.throw(() => ensure.demandArray(data), "Should not demand Array");
	// 	assert.throw(() => ensure.demandBoolean(data), "Should not demand Boolean");
	// 	assert.throw(() => ensure.demandDate(data), "Should not demand Date");
	// 	assert.throw(() => ensure.demandInteger(data), "Should not demand Integer");
	// 	assert.throw(() => ensure.demandNullableArray(data), "Should not demand Nullable Array");
	// 	assert.throw(() => ensure.demandNullableBoolean(data), "Should not demand Nullable Boolean");
	// 	assert.throw(() => ensure.demandNullableDate(data), "Should not demand Nullable Date");
	// 	assert.throw(() => ensure.demandNullableInteger(data), "Should not demand Nullable Integer");
	// 	assert.throw(() => ensure.demandNullableNumber(data), "Should not demand Nullable Number");
	// 	assert.throw(() => ensure.demandNullableObject(data), "Should not demand Nullable Object");
	// 	assert.throw(() => ensure.demandNullableString(data), "Should not demand Nullable String");
	// 	assert.throw(() => ensure.demandNumber(data), "Should not demand Number");
	// 	assert.throw(() => ensure.demandObject(data), "Should not demand Object");
	// 	assert.throw(() => ensure.demandString(data), "Should not demand String");

	// 	const result = data;
	// 	assert.strictEqual(data, result);
	// });


});
