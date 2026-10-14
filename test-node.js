const assert = require('assert');
const { DevDeskApp } = require('./dist/nodes/DevDeskApp/DevDeskApp.node.js');

async function runTests() {
  console.log('🚀 Running Comprehensive End-to-End Tests for DevDeskApp n8n Node...\n');
  const node = new DevDeskApp();

  function createMockExecuteFunctions(parameters, inputItems = [{}]) {
    return {
      getInputData: () => inputItems.map(item => ({ json: item })),
      getNodeParameter: (paramName, index) => {
        return parameters[paramName];
      },
      getNode: () => ({ name: 'DevDeskApp' }),
      continueOnFail: () => false,
    };
  }

  // Test 1: JSON Prettify (2 spaces)
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'json',
      operation: 'prettify',
      jsonInput: '{"a":1,"b":[2,3]}',
      indentation: '2',
    });
    const result = await node.execute.call(mockCtx);
    const expected = JSON.stringify({ a: 1, b: [2, 3] }, null, 2);
    assert.strictEqual(result[0][0].json.formatted, expected);
    assert.strictEqual(result[0][0].json.success, true);
    console.log('✓ Test 1: JSON Prettify passed');
  }

  // Test 2: JSON Minify
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'json',
      operation: 'minify',
      jsonInput: '{\n  "name": "DevDeskApp",\n  "status": "active"\n}',
    });
    const result = await node.execute.call(mockCtx);
    assert.strictEqual(result[0][0].json.minified, '{"name":"DevDeskApp","status":"active"}');
    assert.strictEqual(result[0][0].json.success, true);
    console.log('✓ Test 2: JSON Minify passed');
  }

  // Test 3: JSON Validate (Valid)
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'json',
      operation: 'validate',
      jsonInput: '{"valid": true, "count": 10}',
    });
    const result = await node.execute.call(mockCtx);
    assert.strictEqual(result[0][0].json.valid, true);
    assert.strictEqual(result[0][0].json.parsed.count, 10);
    console.log('✓ Test 3: JSON Validate (Valid) passed');
  }

  // Test 4: JSON Validate (Invalid syntax without crashing)
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'json',
      operation: 'validate',
      jsonInput: '{invalid_json',
    });
    const result = await node.execute.call(mockCtx);
    assert.strictEqual(result[0][0].json.valid, false);
    assert(typeof result[0][0].json.error === 'string');
    console.log('✓ Test 4: JSON Validate (Graceful Error) passed');
  }

  // Test 5: Crypto SHA-256 Hash
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'crypto',
      operation: 'hash',
      textPayload: 'DevDeskApp',
      hashAlgorithm: 'sha256',
    });
    const result = await node.execute.call(mockCtx);
    assert.strictEqual(result[0][0].json.algorithm, 'sha256');
    assert.strictEqual(
      result[0][0].json.hash,
      'fe3c758c236c358f40c63cb5f9cfa9e22d7ab045e5430330269e57b35ed01150'
    );
    console.log('✓ Test 5: Crypto SHA-256 Hash passed');
  }

  // Test 6: Crypto MD5 Hash
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'crypto',
      operation: 'hash',
      textPayload: 'hello world',
      hashAlgorithm: 'md5',
    });
    const result = await node.execute.call(mockCtx);
    assert.strictEqual(result[0][0].json.hash, '5eb63bbbe01eeed093cb22bb8f5acdc3');
    console.log('✓ Test 6: Crypto MD5 Hash passed');
  }

  // Test 7: Base64 Encode & Decode
  {
    const mockCtxEncode = createMockExecuteFunctions({
      resource: 'crypto',
      operation: 'base64Encode',
      textPayload: 'Automate Everything with n8n!',
    });
    const resultEncode = await node.execute.call(mockCtxEncode);
    assert.strictEqual(resultEncode[0][0].json.encoded, 'QXV0b21hdGUgRXZlcnl0aGluZyB3aXRoIG44biE=');

    const mockCtxDecode = createMockExecuteFunctions({
      resource: 'crypto',
      operation: 'base64Decode',
      textPayload: resultEncode[0][0].json.encoded,
    });
    const resultDecode = await node.execute.call(mockCtxDecode);
    assert.strictEqual(resultDecode[0][0].json.decoded, 'Automate Everything with n8n!');
    console.log('✓ Test 7: Base64 Encode & Decode passed');
  }

  // Test 8: UUID v4 Generation
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'crypto',
      operation: 'uuid',
    });
    const result = await node.execute.call(mockCtx);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    assert.strictEqual(result[0][0].json.version, 4);
    assert(uuidRegex.test(result[0][0].json.uuid), 'UUID v4 must match standard RFC format');
    console.log('✓ Test 8: UUID v4 format passed');
  }

  // Test 9: Text Slugify
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'text',
      operation: 'slugify',
      textInput: '  Top 10 Developer Tools for 2026 & Beyond!  ',
    });
    const result = await node.execute.call(mockCtx);
    assert.strictEqual(result[0][0].json.slug, 'top-10-developer-tools-for-2026-beyond');
    console.log('✓ Test 9: Text Slugify passed');
  }

  // Test 10: Case Converter
  {
    const cases = [
      { target: 'camelCase', expected: 'devDeskAppAutomate' },
      { target: 'kebabCase', expected: 'dev-desk-app-automate' },
      { target: 'snakeCase', expected: 'dev_desk_app_automate' },
      { target: 'pascalCase', expected: 'DevDeskAppAutomate' },
    ];
    for (const c of cases) {
      const mockCtx = createMockExecuteFunctions({
        resource: 'text',
        operation: 'caseConverter',
        textInput: 'DevDesk app automate',
        targetCase: c.target,
      });
      const result = await node.execute.call(mockCtx);
      assert.strictEqual(result[0][0].json.result, c.expected);
    }
    console.log('✓ Test 10: Case Converters passed');
  }

  // Test 11: CTC to In-Hand Calculator
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'calculator',
      operation: 'ctcToInHand',
      annualCtc: 1200000,
      basicPercentage: 50,
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.annualCtc, 1200000);
    assert(data.monthlyGross > 0);
    assert(data.monthlyInHand > 0);
    assert(data.monthlyInHand < data.monthlyGross);
    assert.strictEqual(data.breakdown.professionalTax, 200);
    assert(data.breakdown.monthlyBasic > 0);
    assert(data.breakdown.employeePf > 0);
    assert.strictEqual(data.reference, 'https://www.devdeskapp.com/ctc-to-in-hand-calculator');
    console.log('✓ Test 11: CTC Calculator calculations passed');
  }

  console.log('\n🎉 ALL 11 UNIT TESTS PASSED WITH ZERO ERRORS!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
