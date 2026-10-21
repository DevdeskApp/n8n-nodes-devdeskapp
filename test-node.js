const assert = require('assert');
const { DevDeskApp } = require('./dist/nodes/DevDeskApp/DevDeskApp.node.js');

async function runTests() {
  console.log('🚀 Running Comprehensive End-to-End Tests for DevDeskApp n8n Node...\n');
  const node = new DevDeskApp();

  function createMockExecuteFunctions(parameters, inputItems = [{}]) {
    return {
      getInputData: () => inputItems.map(item => ({ json: item })),
      getNodeParameter: (paramName, index, defaultValue) => {
        if (parameters[paramName] !== undefined) {
          return parameters[paramName];
        }
        return defaultValue !== undefined ? defaultValue : '';
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

  // Test 12: URL Encode
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'text',
      operation: 'urlEncode',
      textInput: 'DevDeskApp: Fast & Secure Tools 2026? key=val',
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.encoded, 'DevDeskApp%3A%20Fast%20%26%20Secure%20Tools%202026%3F%20key%3Dval');
    console.log('✓ Test 12: URL Encode passed');
  }

  // Test 13: URL Decode
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'text',
      operation: 'urlDecode',
      textInput: 'DevDeskApp%3A%20Fast%20%26%20Secure%20Tools%202026%3F%20key%3Dval',
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.decoded, 'DevDeskApp: Fast & Secure Tools 2026? key=val');
    console.log('✓ Test 13: URL Decode passed');
  }

  // Test 14: E-Commerce WhatsApp Interactive Payload Builder
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'whatsappPayload',
      eventType: 'orderConfirmation',
      recipientPhone: '+91 98765-43210',
      headerText: 'Order Confirmed! 📦',
      bodyText: 'Hi Customer, your order #4092 has been shipped.',
      footerText: 'Powered by DevDeskApp',
      buttons: 'Confirm Delivery, Change Address, Talk to Support, Extra Fourth Button Over Limit',
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.to, '919876543210');
    assert.strictEqual(data.event, 'orderConfirmation');
    assert.strictEqual(data.buttonCount, 3);
    assert.strictEqual(data.buttons.length, 3);
    assert.strictEqual(data.buttons[0].title, 'Confirm Delivery');
    assert.strictEqual(data.payload.messaging_product, 'whatsapp');
    assert.strictEqual(data.payload.interactive.action.buttons.length, 3);
    assert.strictEqual(data.payload.interactive.header.text, 'Order Confirmed! 📦');
    console.log('✓ Test 14: WhatsApp Interactive Payload passed');
  }

  // Test 15: E-Commerce Dynamic UPI QR & URI Generator
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'upiQr',
      payeeVpa: 'merchant@icici',
      payeeName: 'DevDesk Store',
      amount: 499.00,
      transactionRef: 'ORD4092',
      transactionNote: 'Order ORD4092',
      currency: 'INR',
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.payeeVpa, 'merchant@icici');
    assert.strictEqual(data.amount, 499.00);
    assert(data.upiUri.startsWith('upi://pay?'));
    assert(data.upiUri.includes('pa=merchant%40icici'));
    assert(data.upiUri.includes('am=499.00'));
    assert(data.upiUri.includes('tr=ORD4092'));
    console.log('✓ Test 15: Dynamic UPI QR & URI passed');
  }

  // Test 16: E-Commerce Profit Margin & ROAS Calculator
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'profitCalculator',
      platform: 'shopify',
      sellingPrice: 999,
      cogs: 350,
      shippingFee: 70,
      adSpend: 180,
      rtoRatePct: 15,
      commissionFeePct: 0,
      closingFee: 0,
      gstRatePct: 18,
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.sellingPrice, 999);
    assert(data.effectiveRevenue > 0);
    assert(data.breakEvenRoas > 0);
    assert(data.breakdown.cogsDelivered > 0);
    assert(data.breakdown.rtoLoss > 0);
    console.log('✓ Test 16: Profit Margin & ROAS Calculator passed');
  }

  // Test 17: E-Commerce Webhook Signature Verifier
  {
    const crypto = require('crypto');
    const secret = 'whsec_test_secret_key_123';
    const payload = JSON.stringify({ event: 'payment.captured', id: 'pay_12345', amount: 49900 });

    // 17a. Razorpay (Hex)
    const razorpaySig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const mockCtxRazorpay = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'webhookVerifier',
      provider: 'razorpay',
      rawBody: payload,
      signatureHeader: razorpaySig,
      webhookSecret: secret,
      webhookEvent: 'payment.captured',
    });
    const resultRazorpay = await node.execute.call(mockCtxRazorpay);
    assert.strictEqual(resultRazorpay[0][0].json.verified, true);
    assert.strictEqual(resultRazorpay[0][0].json.provider, 'razorpay');

    // 17b. Shopify (Base64)
    const shopifySig = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('base64');
    const mockCtxShopify = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'webhookVerifier',
      provider: 'shopify',
      rawBody: payload,
      signatureHeader: shopifySig,
      webhookSecret: secret,
      webhookEvent: 'orders/create',
    });
    const resultShopify = await node.execute.call(mockCtxShopify);
    assert.strictEqual(resultShopify[0][0].json.verified, true);
    assert.strictEqual(resultShopify[0][0].json.provider, 'shopify');

    // 17c. Stripe (t=,v1=)
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const stripeSig = crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
    const mockCtxStripe = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'webhookVerifier',
      provider: 'stripe',
      rawBody: payload,
      signatureHeader: `t=${timestamp},v1=${stripeSig}`,
      webhookSecret: secret,
      webhookEvent: 'charge.succeeded',
    });
    const resultStripe = await node.execute.call(mockCtxStripe);
    assert.strictEqual(resultStripe[0][0].json.verified, true);
    assert.strictEqual(resultStripe[0][0].json.provider, 'stripe');
    console.log('✓ Test 17: Webhook Signature Verifier passed (Razorpay, Shopify, Stripe)');
  }

  // Test 18: E-Commerce Catalog Schema Mapper
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'catalogMapper',
      sourcePlatform: 'woocommerce',
      targetPlatform: 'shopify',
      catalogInput: JSON.stringify([
        {
          Name: 'Ergonomic Desk Mat',
          SKU: 'DM-001',
          'Regular price': 799,
          'Sale price': 649,
          Description: '<p>Premium vegan leather desk mat</p>',
          Stock: 25,
          Categories: 'Accessories',
          Images: 'https://example.com/mat.jpg',
        },
      ]),
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.totalItems, 1);
    assert.strictEqual(data.items[0].Title, 'Ergonomic Desk Mat');
    assert.strictEqual(data.items[0]['Variant SKU'], 'DM-001');
    assert.strictEqual(data.items[0]['Variant Price'], '799.00');
    assert.strictEqual(data.items[0]['Variant Compare At Price'], '649.00');
    assert.strictEqual(data.items[0].Handle, 'ergonomic-desk-mat');
    console.log('✓ Test 18: Catalog Schema Mapper passed');
  }

  // Test 19: E-Commerce GST JSON to Tabular Data
  {
    const mockGstr = {
      gstin: '27AAAAA0000A1Z5',
      fp: '032026',
      b2b: [
        {
          ctin: '29BBBBB1111B1Z2',
          inv: [
            {
              inum: 'INV-2026-001',
              idt: '15-03-2026',
              val: 1180,
              itms: [
                {
                  num: 1,
                  itm_det: {
                    rt: 18,
                    txval: 1000,
                    iamt: 180,
                    camt: 0,
                    samt: 0,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const mockCtx = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'gstJsonToTable',
      returnType: 'gstr1',
      gstSection: 'all',
      gstJsonInput: JSON.stringify(mockGstr),
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.gstin, '27AAAAA0000A1Z5');
    assert.strictEqual(data.totalRows, 1);
    assert.strictEqual(data.rows[0].invoiceNumber, 'INV-2026-001');
    assert.strictEqual(data.rows[0].taxableValue, 1000);
    assert.strictEqual(data.rows[0].igst, 180);
    console.log('✓ Test 19: GST JSON to Tabular Data passed');
  }

  // Test 20: E-Commerce Shipping Label Cropper Coordinates
  {
    const mockCtx = createMockExecuteFunctions({
      resource: 'ecommerce',
      operation: 'shippingLabelCrop',
      carrier: 'flipkart',
      pageFormat: 'a4',
      labelSize: '4x6',
      thermalDpi: 203,
    });
    const result = await node.execute.call(mockCtx);
    const data = result[0][0].json;
    assert.strictEqual(data.carrier, 'flipkart');
    assert.strictEqual(data.cropBox.width, 547);
    assert.strictEqual(data.cropBox.height, 370);
    assert.strictEqual(data.dimensions.pixels.width, 812);
    assert.strictEqual(data.dimensions.pixels.height, 1218);
    console.log('✓ Test 20: Shipping Label Cropper Coordinates passed');
  }

  console.log('\n🎉 ALL 20 UNIT TESTS PASSED WITH ZERO ERRORS!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
