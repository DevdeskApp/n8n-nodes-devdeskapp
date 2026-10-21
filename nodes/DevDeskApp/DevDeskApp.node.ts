import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import * as crypto from 'crypto';

export class DevDeskApp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DevDeskApp',
		name: 'devDeskApp',
		icon: { light: 'file:devdeskapp.svg', dark: 'file:devdeskapp.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Run 340+ developer utilities, e-commerce tools, formatters, and calculators from DevDeskApp',
		usableAsTool: true,
		defaults: {
			name: 'DevDeskApp',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'JSON Utility',
						value: 'json',
						description: 'Prettify, minify, and validate JSON data',
					},
					{
						name: 'Crypto & Hash',
						value: 'crypto',
						description: 'Generate hashes (MD5, SHA-256), Base64, and UUIDs',
					},
					{
						name: 'Text & String',
						value: 'text',
						description: 'Slugify text and convert string cases',
					},
					{
						name: 'HR & Calculator',
						value: 'calculator',
						description: 'Compute CTC to in-hand salary and tax deductions',
					},
					{
						name: 'E-Commerce & FinTech',
						value: 'ecommerce',
						description: 'WhatsApp payloads, dynamic UPI QR, profit calculation, GST flattener, catalog mapper, and webhook verifier',
					},
				],
				default: 'json',
			},

			// ----------------------------------
			// JSON Operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['json'],
					},
				},
				options: [
					{
						name: 'Prettify / Format',
						value: 'prettify',
						description: 'Format messy or minified JSON with clean indentation',
						action: 'Prettify JSON',
					},
					{
						name: 'Minify',
						value: 'minify',
						description: 'Remove all unnecessary whitespace from JSON',
						action: 'Minify JSON',
					},
					{
						name: 'Validate',
						value: 'validate',
						description: 'Validate JSON structure and return syntax diagnostics',
						action: 'Validate JSON',
					},
				],
				default: 'prettify',
			},
			{
				displayName: 'JSON Input',
				name: 'jsonInput',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['json'],
					},
				},
				default: '={{ $json }}',
				description: 'The JSON string or object to format/minify/validate',
			},
			{
				displayName: 'Indentation',
				name: 'indentation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['json'],
						operation: ['prettify'],
					},
				},
				options: [
					{ name: '2 Spaces', value: '2' },
					{ name: '4 Spaces', value: '4' },
					{ name: 'Tab', value: 'tab' },
				],
				default: '2',
				description: 'Indentation spacing for prettified output',
			},

			// ----------------------------------
			// Crypto Operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['crypto'],
					},
				},
				options: [
					{
						name: 'Hash (MD5 / SHA-256 / SHA-512)',
						value: 'hash',
						description: 'Generate cryptographic digest hashes',
						action: 'Generate cryptographic hash',
					},
					{
						name: 'Base64 Encode',
						value: 'base64Encode',
						description: 'Encode UTF-8 string to Base64',
						action: 'Encode to base64',
					},
					{
						name: 'Base64 Decode',
						value: 'base64Decode',
						description: 'Decode Base64 string to UTF-8 plain text',
						action: 'Decode from base64',
					},
					{
						name: 'UUID V4',
						value: 'uuid',
						description: 'Generate a random RFC-compliant UUID v4',
						action: 'Generate UUID v4',
					},
				],
				default: 'hash',
			},
			{
				displayName: 'Text/Payload',
				name: 'textPayload',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['crypto'],
						operation: ['hash', 'base64Encode', 'base64Decode'],
					},
				},
				default: '',
				description: 'The text input to encode, decode, or hash',
			},
			{
				displayName: 'Algorithm',
				name: 'hashAlgorithm',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['crypto'],
						operation: ['hash'],
					},
				},
				options: [
					{ name: 'MD5', value: 'md5' },
					{ name: 'SHA-1', value: 'sha1' },
					{ name: 'SHA-256', value: 'sha256' },
					{ name: 'SHA-512', value: 'sha512' },
				],
				default: 'sha256',
				description: 'Cryptographic hash algorithm to use',
			},

			// ----------------------------------
			// Text Operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['text'],
					},
				},
				options: [
					{
						name: 'Slugify String',
						value: 'slugify',
						description: 'Convert strings into clean, SEO-friendly URL slugs',
						action: 'Slugify string',
					},
					{
						name: 'Case Converter',
						value: 'caseConverter',
						description: 'Convert between camelCase, snake_case, kebab-case, uppercase, etc',
						action: 'Convert case',
					},
					{
						name: 'URL Encode',
						value: 'urlEncode',
						description: 'Encode text strings into URL-safe percentage-encoded strings',
						action: 'Url encode string',
					},
					{
						name: 'URL Decode',
						value: 'urlDecode',
						description: 'Decode URL percentage-encoded strings back to normal text',
						action: 'Url decode string',
					},
				],
				default: 'slugify',
			},
			{
				displayName: 'Text Input',
				name: 'textInput',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['text'],
					},
				},
				default: '',
				description: 'Text string to transform',
			},
			{
				displayName: 'Target Case',
				name: 'targetCase',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['caseConverter'],
					},
				},
				options: [
					{ name: 'camelCase', value: 'camelCase' },
					{ name: 'kebab-case', value: 'kebabCase' },
					{ name: 'Lowercase', value: 'lowerCase' },
					{ name: 'PascalCase', value: 'pascalCase' },
					{ name: 'Snake_Case', value: 'snakeCase' },
					{ name: 'Uppercase', value: 'upperCase' },
				],
				default: 'kebabCase',
				description: 'The casing format to convert the string to',
			},

			// ----------------------------------
			// Calculator Operations (CTC to In-Hand)
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['calculator'],
					},
				},
				options: [
					{
						name: 'CTC to In-Hand Salary',
						value: 'ctcToInHand',
						description: 'Calculate monthly take-home salary, PF, and estimated taxes from annual CTC',
						action: 'Calculate in hand salary',
					},
				],
				default: 'ctcToInHand',
			},
			{
				displayName: 'Annual CTC',
				name: 'annualCtc',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['calculator'],
						operation: ['ctcToInHand'],
					},
				},
				default: 1200000,
				description: 'Annual Cost to Company (CTC) package in local currency',
			},
			{
				displayName: 'Basic Salary Percentage',
				name: 'basicPercentage',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['calculator'],
						operation: ['ctcToInHand'],
					},
				},
				default: 50,
				description: 'Percentage of CTC designated as Basic Pay (standard is 40% - 50%)',
			},

			// ----------------------------------
			// E-Commerce & FinTech Operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ecommerce'],
					},
				},
				options: [
					{
						name: 'WhatsApp Interactive Payload',
						value: 'whatsappPayload',
						description: 'Build Meta WhatsApp Cloud API interactive button payload',
						action: 'Build WhatsApp interactive message payload',
					},
					{
						name: 'Dynamic UPI QR & URI',
						value: 'upiQr',
						description: 'Generate NPCI-compliant dynamic UPI payment URI and QR parameters',
						action: 'Generate NPCI dynamic UPI payment URI',
					},
					{
						name: 'Profit Margin & ROAS Calculator',
						value: 'profitCalculator',
						description: 'Calculate net profit margin, break-even ROAS, and RTO return loss',
						action: 'Calculate profit margin and break-even ROAS',
					},
					{
						name: 'Webhook Signature Verifier',
						value: 'webhookVerifier',
						description: 'Verify HMAC-SHA256 signature for Razorpay, Shopify, or Stripe',
						action: 'Verify payment webhook signature',
					},
					{
						name: 'Catalog Schema Mapper',
						value: 'catalogMapper',
						description: 'Map product catalog data between Shopify, WooCommerce, and Google Merchant',
						action: 'Map catalog items between platforms',
					},
					{
						name: 'GST JSON to Tabular Data',
						value: 'gstJsonToTable',
						description: 'Flatten GSTR-1, GSTR-3B, or GSTR-2B JSON offline tool data into flat rows',
						action: 'Flatten GST portal JSON to tabular rows',
					},
					{
						name: 'Shipping Label Cropper Coordinates',
						value: 'shippingLabelCrop',
						description: 'Compute exact thermal print crop box dimensions for marketplace invoices',
						action: 'Compute shipping label thermal crop coordinates',
					},
				],
				default: 'whatsappPayload',
			},

			// WhatsApp Payload Builder Parameters
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['whatsappPayload'],
					},
				},
				options: [
					{ name: 'Order Confirmation / Shipped', value: 'orderConfirmation' },
					{ name: 'Payment Request / Reminder', value: 'paymentRequest' },
					{ name: 'Abandoned Cart Recovery', value: 'abandonedCart' },
					{ name: 'Custom Interactive Message', value: 'custom' },
				],
				default: 'orderConfirmation',
				description: 'The e-commerce event category for this WhatsApp notification',
			},
			{
				displayName: 'Recipient Phone',
				name: 'recipientPhone',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['whatsappPayload'],
					},
				},
				default: '919876543210',
				description: 'Recipient phone number with country code (e.g. 919876543210 for India)',
			},
			{
				displayName: 'Header Text',
				name: 'headerText',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['whatsappPayload'],
					},
				},
				default: 'Order Confirmed! 📦',
				description: 'Bold header text displayed above the WhatsApp message bubble',
			},
			{
				displayName: 'Body Text',
				name: 'bodyText',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['whatsappPayload'],
					},
				},
				default: 'Hi Customer, your order #4092 has been shipped and will be delivered tomorrow.',
				description: 'Main body message content. Supports WhatsApp formatting (*bold*, _italic_).',
			},
			{
				displayName: 'Footer Text',
				name: 'footerText',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['whatsappPayload'],
					},
				},
				default: 'Powered by DevDeskApp',
				description: 'Small footer text at the bottom of the WhatsApp bubble',
			},
			{
				displayName: 'Buttons (Comma-Separated or JSON)',
				name: 'buttons',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['whatsappPayload'],
					},
				},
				default: 'Confirm Delivery, Change Address, Talk to Support',
				description: 'Up to 3 quick-reply buttons (Max 20 chars each). Comma-separated or JSON array of strings.',
			},

			// Dynamic UPI QR Parameters
			{
				displayName: 'Payee VPA (UPI ID)',
				name: 'payeeVpa',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['upiQr'],
					},
				},
				default: 'merchant@icici',
				description: 'Virtual Payment Address / UPI ID of the merchant (e.g. store@okaxis)',
			},
			{
				displayName: 'Payee Name',
				name: 'payeeName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['upiQr'],
					},
				},
				default: 'DevDesk Store',
				description: 'Registered merchant or business name shown in UPI payment apps',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['upiQr'],
					},
				},
				default: 499.00,
				description: 'Payment amount in INR (leave empty for dynamic customer-entered amount)',
			},
			{
				displayName: 'Transaction Reference / Order ID',
				name: 'transactionRef',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['upiQr'],
					},
				},
				default: 'ORD4092',
				description: 'Order reference number for auto-reconciliation',
			},
			{
				displayName: 'Transaction Note',
				name: 'transactionNote',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['upiQr'],
					},
				},
				default: 'Order ORD4092',
				description: 'Short note displayed on customer payment screen',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['upiQr'],
					},
				},
				default: 'INR',
				description: 'Currency code (NPCI requires INR)',
			},

			// Profit Margin Calculator Parameters
			{
				displayName: 'Platform Preset',
				name: 'platform',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				options: [
					{ name: 'Shopify / D2C Brand', value: 'shopify' },
					{ name: 'Amazon India', value: 'amazon' },
					{ name: 'Flipkart', value: 'flipkart' },
					{ name: 'Custom Marketplace', value: 'custom' },
				],
				default: 'shopify',
				description: 'Platform commission and fee preset structure',
			},
			{
				displayName: 'Selling Price (Gross)',
				name: 'sellingPrice',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				default: 999,
				description: 'Final retail selling price paid by customer',
			},
			{
				displayName: 'COGS / Product Cost',
				name: 'cogs',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				default: 350,
				description: 'Manufacturing, sourcing, or wholesale cost of product',
			},
			{
				displayName: 'Shipping Fee',
				name: 'shippingFee',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				default: 70,
				description: 'Forward shipping & logistics cost per parcel',
			},
			{
				displayName: 'Ad Spend / CAC',
				name: 'adSpend',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				default: 180,
				description: 'Customer Acquisition Cost (Meta/Google ad spend per order)',
			},
			{
				displayName: 'RTO / Return Rate (%)',
				name: 'rtoRatePct',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				default: 15,
				description: 'Return to Origin percentage (standard 15% - 25% for Indian COD)',
			},
			{
				displayName: 'Commission Fee (%)',
				name: 'commissionFeePct',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				default: 12,
				description: 'Marketplace referral fee percentage',
			},
			{
				displayName: 'Fixed Closing Fee',
				name: 'closingFee',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				default: 25,
				description: 'Fixed per-order closing fee charged by marketplace',
			},
			{
				displayName: 'GST Rate (%)',
				name: 'gstRatePct',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['profitCalculator'],
					},
				},
				default: 18,
				description: 'GST rate applied on logistics and platform service fees',
			},

			// Webhook Verifier Parameters
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['webhookVerifier'],
					},
				},
				options: [
					{ name: 'Razorpay', value: 'razorpay' },
					{ name: 'Shopify', value: 'shopify' },
					{ name: 'Stripe', value: 'stripe' },
					{ name: 'Custom HMAC-SHA256', value: 'custom' },
				],
				default: 'razorpay',
				description: 'Payment gateway or platform signing the webhook',
			},
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['webhookVerifier'],
					},
				},
				default: '',
				description: 'Shared webhook secret key from the provider dashboard',
			},
			{
				displayName: 'Signature Header',
				name: 'signatureHeader',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['webhookVerifier'],
					},
				},
				default: '',
				description: 'Incoming signature header (e.g. x-razorpay-signature, x-shopify-hmac-sha256, or stripe-signature)',
			},
			{
				displayName: 'Raw Payload Body',
				name: 'rawBody',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['webhookVerifier'],
					},
				},
				default: '={{ $json }}',
				description: 'Raw request body string or JSON object',
			},
			{
				displayName: 'Event Name',
				name: 'webhookEvent',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['webhookVerifier'],
					},
				},
				default: 'payment.captured',
				description: 'Webhook event name / topic for tracking and audit logs',
			},

			// Catalog Mapper Parameters
			{
				displayName: 'Source Platform',
				name: 'sourcePlatform',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['catalogMapper'],
					},
				},
				options: [
					{ name: 'WooCommerce', value: 'woocommerce' },
					{ name: 'Shopify', value: 'shopify' },
					{ name: 'Google Merchant Center', value: 'googleMerchant' },
				],
				default: 'woocommerce',
				description: 'Original e-commerce platform exporting the catalog',
			},
			{
				displayName: 'Target Platform',
				name: 'targetPlatform',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['catalogMapper'],
					},
				},
				options: [
					{ name: 'Shopify', value: 'shopify' },
					{ name: 'WooCommerce', value: 'woocommerce' },
					{ name: 'Google Merchant Center', value: 'googleMerchant' },
				],
				default: 'shopify',
				description: 'Destination platform format for importing products',
			},
			{
				displayName: 'Catalog Items Input',
				name: 'catalogInput',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['catalogMapper'],
					},
				},
				default: '={{ $json.items || [$json] }}',
				description: 'Array of product objects or JSON items to map',
			},

			// GST JSON to Table Parameters
			{
				displayName: 'GST Return Type',
				name: 'returnType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['gstJsonToTable'],
					},
				},
				options: [
					{ name: 'GSTR-1 (Outward Supplies)', value: 'gstr1' },
					{ name: 'GSTR-3B (Monthly Summary)', value: 'gstr3b' },
					{ name: 'GSTR-2B (Auto-Drafted ITC)', value: 'gstr2b' },
				],
				default: 'gstr1',
				description: 'Type of GST return file exported from offline tool or portal',
			},
			{
				displayName: 'Section',
				name: 'gstSection',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['gstJsonToTable'],
						returnType: ['gstr1'],
					},
				},
				options: [
					{ name: 'All Sections', value: 'all' },
					{ name: 'B2B (Business to Business)', value: 'b2b' },
					{ name: 'B2CS (B2C Small Invoices)', value: 'b2cs' },
				],
				default: 'all',
				description: 'Filter specific section from GSTR-1',
			},
			{
				displayName: 'GST JSON Input',
				name: 'gstJsonInput',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['gstJsonToTable'],
					},
				},
				default: '={{ $json }}',
				description: 'GSTR offline JSON file contents or parsed object',
			},

			// Shipping Label Cropper Coordinates Parameters
			{
				displayName: 'Marketplace / Carrier',
				name: 'carrier',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['shippingLabelCrop'],
					},
				},
				options: [
					{ name: 'Flipkart Logistics', value: 'flipkart' },
					{ name: 'Amazon ATS', value: 'amazon' },
					{ name: 'Meesho / Shadowfax', value: 'meesho' },
					{ name: 'Delhivery', value: 'delhivery' },
					{ name: 'Custom / Generic A4', value: 'custom' },
				],
				default: 'flipkart',
				description: 'Shipping carrier generating invoice and barcode label',
			},
			{
				displayName: 'Page Format',
				name: 'pageFormat',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['shippingLabelCrop'],
					},
				},
				options: [
					{ name: 'A4 Standard (595 x 842 pt)', value: 'a4' },
					{ name: 'Letter (612 x 792 pt)', value: 'letter' },
				],
				default: 'a4',
				description: 'Source PDF page dimension',
			},
			{
				displayName: 'Label Size',
				name: 'labelSize',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['shippingLabelCrop'],
					},
				},
				options: [
					{ name: '4x6 Inch (100 x 150 mm)', value: '4x6' },
					{ name: 'A6 Standard', value: 'a6' },
				],
				default: '4x6',
				description: 'Target thermal roll label size',
			},
			{
				displayName: 'Thermal Printer DPI',
				name: 'thermalDpi',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['ecommerce'],
						operation: ['shippingLabelCrop'],
					},
				},
				options: [
					{ name: '203 DPI (Standard Thermal Barcode)', value: '203' },
					{ name: '300 DPI (High Resolution)', value: '300' },
				],
				default: '203',
				description: 'Hardware resolution of thermal sticker printer',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let result: Record<string, any> = {};

				// ---------------------------------------------
				// JSON Resource Execution
				// ---------------------------------------------
				if (resource === 'json') {
					const rawInput = this.getNodeParameter('jsonInput', i);
					let parsed: any;
					if (typeof rawInput === 'string') {
						try {
							parsed = JSON.parse(rawInput);
						} catch (e: any) {
							if (operation === 'validate') {
								result = {
									valid: false,
									error: e.message || 'Invalid JSON syntax',
								};
								returnData.push({ json: result, pairedItem: { item: i } });
								continue;
							}
							throw new NodeOperationError(this.getNode(), `Invalid JSON input: ${e.message}`, { itemIndex: i });
						}
					} else {
						parsed = rawInput;
					}

					if (operation === 'prettify') {
						const indentParam = this.getNodeParameter('indentation', i) as string;
						const indent = indentParam === 'tab' ? '\t' : Number(indentParam);
						result = {
							formatted: JSON.stringify(parsed, null, indent),
							success: true,
						};
					} else if (operation === 'minify') {
						result = {
							minified: JSON.stringify(parsed),
							success: true,
						};
					} else if (operation === 'validate') {
						result = {
							valid: true,
							parsed,
						};
					}
				}

				// ---------------------------------------------
				// Crypto Resource Execution
				// ---------------------------------------------
				else if (resource === 'crypto') {
					if (operation === 'uuid') {
						result = {
							uuid: crypto.randomUUID(),
							version: 4,
						};
					} else {
						const textPayload = (this.getNodeParameter('textPayload', i) as string) || '';

						if (operation === 'hash') {
							const algo = this.getNodeParameter('hashAlgorithm', i) as string;
							const hash = crypto.createHash(algo).update(textPayload, 'utf8').digest('hex');
							result = {
								algorithm: algo,
								input: textPayload,
								hash,
							};
						} else if (operation === 'base64Encode') {
							result = {
								encoded: Buffer.from(textPayload, 'utf8').toString('base64'),
								original: textPayload,
							};
						} else if (operation === 'base64Decode') {
							result = {
								decoded: Buffer.from(textPayload, 'base64').toString('utf8'),
								original: textPayload,
							};
						}
					}
				}

				// ---------------------------------------------
				// Text Resource Execution
				// ---------------------------------------------
				else if (resource === 'text') {
					const textInput = (this.getNodeParameter('textInput', i) as string) || '';

					if (operation === 'slugify') {
						const slug = textInput
							.toLowerCase()
							.trim()
							.replace(/[^\w\s-]/g, '')
							.replace(/[\s_-]+/g, '-')
							.replace(/^-+|-+$/g, '');
						result = {
							original: textInput,
							slug,
						};
					} else if (operation === 'caseConverter') {
						const targetCase = this.getNodeParameter('targetCase', i) as string;
						const words = textInput
							.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
							.replace(/[^a-zA-Z0-9]+/g, ' ')
							.trim()
							.toLowerCase()
							.split(/\s+/);

						let converted = '';
						if (targetCase === 'camelCase') {
							converted = words.map((w, idx) => (idx === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))).join('');
						} else if (targetCase === 'pascalCase') {
							converted = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
						} else if (targetCase === 'kebabCase') {
							converted = words.join('-');
						} else if (targetCase === 'snakeCase') {
							converted = words.join('_');
						} else if (targetCase === 'upperCase') {
							converted = textInput.toUpperCase();
						} else if (targetCase === 'lowerCase') {
							converted = textInput.toLowerCase();
						}

						result = {
							original: textInput,
							casing: targetCase,
							result: converted,
						};
					} else if (operation === 'urlEncode') {
						result = {
							original: textInput,
							encoded: encodeURIComponent(textInput),
							success: true,
						};
					} else if (operation === 'urlDecode') {
						try {
							result = {
								original: textInput,
								decoded: decodeURIComponent(textInput),
								success: true,
							};
						} catch (error) {
							result = {
								original: textInput,
								decoded: textInput,
								success: false,
								error: (error as Error).message,
							};
						}
					}
				}

				// ---------------------------------------------
				// Calculator (CTC to In-Hand) Execution
				// ---------------------------------------------
				else if (resource === 'calculator') {
					if (operation === 'ctcToInHand') {
						const ctc = Number(this.getNodeParameter('annualCtc', i)) || 0;
						const basicPct = Number(this.getNodeParameter('basicPercentage', i)) || 50;

						const annualBasic = (ctc * basicPct) / 100;
						const monthlyBasic = annualBasic / 12;

						// Standard PF: 12% of basic capped or statutory
						const employeeMonthlyPf = Math.min(monthlyBasic * 0.12, 1800);
						const employerMonthlyPf = employeeMonthlyPf;

						// Professional Tax standard ₹200/mo
						const monthlyProfessionalTax = 200;

						// Approximate income tax under simplified new regime
						let estimatedAnnualTax = 0;
						if (ctc > 700000) {
							const taxable = Math.max(0, ctc - 75000); // Standard deduction
							if (taxable > 1500000) {
								estimatedAnnualTax = 150000 + (taxable - 1500000) * 0.3;
							} else if (taxable > 1200000) {
								estimatedAnnualTax = 90000 + (taxable - 1200000) * 0.2;
							} else if (taxable > 1000000) {
								estimatedAnnualTax = 60000 + (taxable - 1000000) * 0.15;
							} else if (taxable > 700000) {
								estimatedAnnualTax = 30000 + (taxable - 700000) * 0.1;
							}
						}

						const monthlyTax = estimatedAnnualTax / 12;
						const monthlyGross = (ctc - employerMonthlyPf * 12) / 12;
						const monthlyInHand = Math.max(0, monthlyGross - employeeMonthlyPf - monthlyProfessionalTax - monthlyTax);

						result = {
							annualCtc: ctc,
							monthlyGross: Math.round(monthlyGross),
							monthlyInHand: Math.round(monthlyInHand),
							breakdown: {
								monthlyBasic: Math.round(monthlyBasic),
								employeePf: Math.round(employeeMonthlyPf),
								employerPf: Math.round(employerMonthlyPf),
								professionalTax: monthlyProfessionalTax,
								estimatedMonthlyTds: Math.round(monthlyTax),
							},
							taxRegime: 'India Standard / New Tax Benchmark',
							reference: 'https://www.devdeskapp.com/ctc-to-in-hand-calculator',
						};
					}
				}

				// ---------------------------------------------
				// E-Commerce & FinTech Resource Execution
				// ---------------------------------------------
				else if (resource === 'ecommerce') {
					// 1. WhatsApp Interactive Payload Builder
					if (operation === 'whatsappPayload') {
						const eventType = (this.getNodeParameter('eventType', i, 'orderConfirmation') as string);
						const rawPhone = (this.getNodeParameter('recipientPhone', i, '') as string) || '';
						const cleanPhone = String(rawPhone).replace(/[^\d]/g, '').replace(/^0+/, '');
						const headerText = (this.getNodeParameter('headerText', i, '') as string) || '';
						const bodyText = (this.getNodeParameter('bodyText', i, '') as string) || '';
						const footerText = (this.getNodeParameter('footerText', i, '') as string) || '';
						const rawButtons = this.getNodeParameter('buttons', i, 'Confirm Delivery, Change Address, Talk to Support');

						let buttonList: Array<{ id: string; title: string }> = [];
						if (Array.isArray(rawButtons)) {
							buttonList = rawButtons.slice(0, 3).map((b: any, idx: number) => ({
								id: b.id || `btn_${idx + 1}`,
								title: String(b.title || b.text || b).slice(0, 20),
							}));
						} else if (typeof rawButtons === 'string') {
							let parsed: any;
							try {
								parsed = JSON.parse(rawButtons);
								if (Array.isArray(parsed)) {
									buttonList = parsed.slice(0, 3).map((b: any, idx: number) => ({
										id: b.id || `btn_${idx + 1}`,
										title: String(b.title || b.text || b).slice(0, 20),
									}));
								}
							} catch {
								buttonList = rawButtons
									.split(',')
									.map(b => b.trim())
									.filter(Boolean)
									.slice(0, 3)
									.map((title, idx) => ({
										id: `btn_${idx + 1}`,
										title: title.slice(0, 20),
									}));
							}
						}

						const interactivePayload: Record<string, any> = {
							messaging_product: 'whatsapp',
							recipient_type: 'individual',
							to: cleanPhone,
							type: 'interactive',
							interactive: {
								type: 'button',
								...(headerText ? { header: { type: 'text', text: headerText } } : {}),
								body: { text: bodyText },
								...(footerText ? { footer: { text: footerText } } : {}),
								action: {
									buttons: buttonList.map(btn => ({
										type: 'reply',
										reply: {
											id: btn.id,
											title: btn.title,
										},
									})),
								},
							},
						};

						result = {
							payload: interactivePayload,
							event: eventType,
							to: cleanPhone,
							buttonCount: buttonList.length,
							buttons: buttonList,
							preview: {
								header: headerText,
								body: bodyText,
								footer: footerText,
								buttonTitles: buttonList.map(b => b.title),
							},
							metaApiEndpoint: 'https://graph.facebook.com/v20.0/PHONE_NUMBER_ID/messages',
							reference: 'https://www.devdeskapp.com/whatsapp-payload-builder',
						};
					}

					// 2. Dynamic UPI QR & URI Generator
					else if (operation === 'upiQr') {
						const payeeVpa = (this.getNodeParameter('payeeVpa', i, '') as string).trim();
						const payeeName = (this.getNodeParameter('payeeName', i, '') as string).trim();
						const amount = this.getNodeParameter('amount', i, null);
						const tr = (this.getNodeParameter('transactionRef', i, '') as string).trim();
						const tn = (this.getNodeParameter('transactionNote', i, '') as string).trim();
						const cu = (this.getNodeParameter('currency', i, 'INR') as string).trim();

						const params = new URLSearchParams();
						if (payeeVpa) params.set('pa', payeeVpa);
						if (payeeName) params.set('pn', payeeName);
						if (amount !== null && amount !== '' && !isNaN(Number(amount))) {
							params.set('am', Number(amount).toFixed(2));
						}
						if (tr) params.set('tr', tr);
						if (tn) params.set('tn', tn);
						params.set('cu', cu || 'INR');

						const upiUri = `upi://pay?${params.toString()}`;
						result = {
							upiUri,
							payeeVpa,
							payeeName,
							amount: amount !== null && amount !== '' ? Number(amount) : null,
							currency: cu || 'INR',
							transactionRef: tr,
							transactionNote: tn,
							intentUrl: upiUri,
							reference: 'https://www.devdeskapp.com/upi-qr-generator',
						};
					}

					// 3. Profit Margin & ROAS Calculator
					else if (operation === 'profitCalculator') {
						const platform = this.getNodeParameter('platform', i, 'shopify') as string;
						const sellingPrice = Number(this.getNodeParameter('sellingPrice', i, 0));
						const cogs = Number(this.getNodeParameter('cogs', i, 0));
						const shippingFee = Number(this.getNodeParameter('shippingFee', i, 0));
						const adSpend = Number(this.getNodeParameter('adSpend', i, 0));
						const rtoRatePct = Number(this.getNodeParameter('rtoRatePct', i, 0));
						const commissionFeePct = Number(this.getNodeParameter('commissionFeePct', i, 0));
						const closingFee = Number(this.getNodeParameter('closingFee', i, 0));
						const gstRatePct = Number(this.getNodeParameter('gstRatePct', i, 18));

						const rtoFactor = rtoRatePct / 100;
						const deliveredFactor = 1 - rtoFactor;
						const commission = (sellingPrice * commissionFeePct) / 100;
						const gstOnFees = ((commission + closingFee + shippingFee) * gstRatePct) / 100;
						const rtoShippingLoss = shippingFee * 1.5 * rtoFactor;
						const effectiveRevenue = sellingPrice * deliveredFactor;
						const totalDeductions = (cogs * deliveredFactor) + commission + closingFee + shippingFee + gstOnFees + rtoShippingLoss + adSpend;
						const netProfit = effectiveRevenue - totalDeductions;
						const netMarginPct = effectiveRevenue > 0 ? (netProfit / effectiveRevenue) * 100 : 0;
						const breakEvenDenominator = sellingPrice - cogs - commission - closingFee - shippingFee;
						const breakEvenRoas = breakEvenDenominator > 0 ? sellingPrice / breakEvenDenominator : 0;

						result = {
							platform,
							sellingPrice,
							cogs,
							effectiveRevenue: Math.round(effectiveRevenue * 100) / 100,
							netProfit: Math.round(netProfit * 100) / 100,
							netMarginPct: Math.round(netMarginPct * 10) / 10,
							breakEvenRoas: Math.round(breakEvenRoas * 100) / 100,
							totalDeductions: Math.round(totalDeductions * 100) / 100,
							breakdown: {
								cogsDelivered: Math.round(cogs * deliveredFactor * 100) / 100,
								platformCommission: Math.round(commission * 100) / 100,
								closingFee,
								forwardShipping: shippingFee,
								gstOnFees: Math.round(gstOnFees * 100) / 100,
								rtoLoss: Math.round(rtoShippingLoss * 100) / 100,
								adSpend,
							},
							deliveredRatePct: Math.round(deliveredFactor * 100),
							rtoRatePct,
							reference: 'https://www.devdeskapp.com/marketplace-profit-calculator',
						};
					}

					// 4. Webhook Signature Verifier
					else if (operation === 'webhookVerifier') {
						const provider = this.getNodeParameter('provider', i, 'razorpay') as string;
						const rawBodyInput = this.getNodeParameter('rawBody', i, '');
						const signatureHeader = String(this.getNodeParameter('signatureHeader', i, '')).trim();
						const secret = String(this.getNodeParameter('webhookSecret', i, '')).trim();
						const webhookEvent = this.getNodeParameter('webhookEvent', i, 'payment.captured') as string;

						const rawBody = typeof rawBodyInput === 'object' ? JSON.stringify(rawBodyInput) : String(rawBodyInput);
						let verified = false;
						let computedSignature = '';
						let timestamp: string | null = null;
						let error: string | null = null;

						if (!secret) {
							error = 'Webhook secret is empty';
						} else if (!signatureHeader) {
							error = 'Signature header is missing';
						} else {
							try {
								if (provider === 'razorpay' || provider === 'custom') {
									computedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
									verified = computedSignature.toLowerCase() === signatureHeader.toLowerCase();
								} else if (provider === 'shopify') {
									computedSignature = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');
									verified = computedSignature === signatureHeader;
								} else if (provider === 'stripe') {
									const parts = signatureHeader.split(',');
									const tPart = parts.find(p => p.trim().startsWith('t='));
									const v1Part = parts.find(p => p.trim().startsWith('v1='));
									if (!tPart || !v1Part) {
										error = 'Invalid Stripe signature format: missing t= or v1=';
									} else {
										const t = tPart.split('=')[1];
										const v1 = v1Part.split('=')[1];
										timestamp = t;
										computedSignature = crypto.createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
										verified = computedSignature === v1;
									}
								}
							} catch (e: any) {
								error = e.message;
								verified = false;
							}
						}

						result = {
							verified,
							provider,
							event: webhookEvent,
							...(timestamp ? { timestamp } : {}),
							...(error ? { error } : {}),
							reference: 'https://www.devdeskapp.com/webhook-signature-verifier',
						};
					}

					// 5. Catalog Schema Mapper
					else if (operation === 'catalogMapper') {
						const sourcePlatform = this.getNodeParameter('sourcePlatform', i, 'woocommerce') as string;
						const targetPlatform = this.getNodeParameter('targetPlatform', i, 'shopify') as string;
						const rawInput = this.getNodeParameter('catalogInput', i);

						let itemsList: any[] = [];
						if (Array.isArray(rawInput)) {
							itemsList = rawInput;
						} else if (typeof rawInput === 'object' && rawInput !== null) {
							itemsList = [rawInput];
						} else if (typeof rawInput === 'string') {
							try {
								const parsed = JSON.parse(rawInput);
								itemsList = Array.isArray(parsed) ? parsed : [parsed];
							} catch {
								itemsList = [{ title: rawInput }];
							}
						}

						const mapped = itemsList.map((item, idx) => {
							const title = item.title || item.Name || item['Product Name'] || item['Post Title'] || `Product ${idx + 1}`;
							const sku = item.sku || item.SKU || `SKU-${idx + 1}`;
							const price = Number(item.price || item.Price || item['Regular price'] || item['Variant Price'] || 0);
							const compareAtPrice = Number(item.compareAtPrice || item['Sale price'] || item['Variant Compare At Price'] || 0) || null;
							const description = item.description || item.Description || item['Post Content'] || '';
							const stock = Number(item.stock || item.Stock || item['Variant Inventory Qty'] || 10);
							const handle = (item.handle || item.Handle || item.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
							const image = item.image || item.Image || item['Image Src'] || item['Images'] || '';
							const category = item.category || item.Category || item['Categories'] || 'General';

							if (targetPlatform === 'shopify') {
								return {
									Handle: handle,
									Title: title,
									'Body (HTML)': description,
									Vendor: item.vendor || 'DevDeskApp',
									'Standard Product Type': category,
									Tags: item.tags || 'Imported',
									Published: 'TRUE',
									'Variant SKU': sku,
									'Variant Price': price.toFixed(2),
									'Variant Compare At Price': compareAtPrice ? compareAtPrice.toFixed(2) : '',
									'Variant Inventory Qty': stock,
									'Image Src': image,
									Status: 'active',
								};
							} else if (targetPlatform === 'woocommerce') {
								return {
									ID: item.id || '',
									Type: 'simple',
									SKU: sku,
									Name: title,
									Published: 1,
									'Regular price': price.toFixed(2),
									'Sale price': compareAtPrice ? compareAtPrice.toFixed(2) : '',
									Description: description,
									Stock: stock,
									Categories: category,
									Images: image,
								};
							} else if (targetPlatform === 'googleMerchant') {
								return {
									id: sku,
									title,
									description: String(description).replace(/<[^>]*>?/gm, '').slice(0, 150),
									link: `https://example.com/products/${handle}`,
									image_link: image,
									availability: stock > 0 ? 'in_stock' : 'out_of_stock',
									price: `${price.toFixed(2)} INR`,
									condition: 'new',
								};
							}
							return item;
						});

						result = {
							items: mapped,
							totalItems: mapped.length,
							sourcePlatform,
							targetPlatform,
							reference: 'https://www.devdeskapp.com/ecommerce-catalog-mapper',
						};
					}

					// 6. GST JSON to Tabular Data
					else if (operation === 'gstJsonToTable') {
						const returnType = this.getNodeParameter('returnType', i, 'gstr1') as string;
						const gstSection = this.getNodeParameter('gstSection', i, 'all') as string;
						const rawInput = this.getNodeParameter('gstJsonInput', i);

						let parsed: any = rawInput;
						if (typeof rawInput === 'string') {
							try {
								parsed = JSON.parse(rawInput);
							} catch (e: any) {
								throw new NodeOperationError(this.getNode(), `Invalid GST JSON: ${e.message}`, { itemIndex: i });
							}
						}

						const gstin = parsed.gstin || parsed.GSTIN || 'N/A';
						const fp = parsed.fp || parsed.financial_period || 'N/A';
						const rows: any[] = [];

						if (returnType === 'gstr1') {
							if ((gstSection === 'all' || gstSection === 'b2b') && Array.isArray(parsed.b2b)) {
								for (const b2bItem of parsed.b2b) {
									const ctin = b2bItem.ctin || '';
									const invs = Array.isArray(b2bItem.inv) ? b2bItem.inv : [];
									for (const inv of invs) {
										const inum = inv.inum || '';
										const idt = inv.idt || '';
										const val = Number(inv.val || 0);
										const itms = Array.isArray(inv.itms) ? inv.itms : [];
										for (const itm of itms) {
											const det = itm.itm_det || {};
											rows.push({
												section: 'B2B',
												gstin,
												period: fp,
												buyerGstin: ctin,
												invoiceNumber: inum,
												invoiceDate: idt,
												invoiceValue: val,
												rate: det.rt || 0,
												taxableValue: det.txval || 0,
												igst: det.iamt || 0,
												cgst: det.camt || 0,
												sgst: det.samt || 0,
											});
										}
									}
								}
							}

							if ((gstSection === 'all' || gstSection === 'b2cs') && Array.isArray(parsed.b2cs)) {
								for (const b2csItem of parsed.b2cs) {
									rows.push({
										section: 'B2CS',
										gstin,
										period: fp,
										buyerGstin: 'Consumer',
										invoiceNumber: 'Consolidated',
										invoiceDate: 'Monthly',
										invoiceValue: (b2csItem.txval || 0) + (b2csItem.iamt || 0) + (b2csItem.camt || 0) + (b2csItem.samt || 0),
										rate: b2csItem.rt || 0,
										taxableValue: b2csItem.txval || 0,
										igst: b2csItem.iamt || 0,
										cgst: b2csItem.camt || 0,
										sgst: b2csItem.samt || 0,
									});
								}
							}
						} else if (returnType === 'gstr3b') {
							const supDetails = parsed.sup_details?.osup_det || {};
							rows.push({
								section: 'GSTR-3B 3.1(a) Outward Taxable',
								gstin,
								period: fp,
								taxableValue: supDetails.txval || 0,
								igst: supDetails.iamt || 0,
								cgst: supDetails.camt || 0,
								sgst: supDetails.samt || 0,
							});
						} else if (returnType === 'gstr2b') {
							const itcDetails = parsed.itc_summ || parsed.data?.itc_summ || {};
							rows.push({
								section: 'GSTR-2B Available ITC',
								gstin,
								period: fp,
								taxableValue: itcDetails.txval || 0,
								igst: itcDetails.iamt || 0,
								cgst: itcDetails.camt || 0,
								sgst: itcDetails.samt || 0,
							});
						}

						const totalTaxable = rows.reduce((sum, r) => sum + (Number(r.taxableValue) || 0), 0);
						const totalTax = rows.reduce((sum, r) => sum + (Number(r.igst) || 0) + (Number(r.cgst) || 0) + (Number(r.sgst) || 0), 0);

						result = {
							rows,
							totalRows: rows.length,
							totalTaxableValue: Math.round(totalTaxable * 100) / 100,
							totalTax: Math.round(totalTax * 100) / 100,
							gstin,
							period: fp,
							returnType,
							reference: 'https://www.devdeskapp.com/gst-json-to-excel',
						};
					}

					// 7. Shipping Label Cropper Coordinates
					else if (operation === 'shippingLabelCrop') {
						const carrier = this.getNodeParameter('carrier', i, 'flipkart') as string;
						const pageFormat = this.getNodeParameter('pageFormat', i, 'a4') as string;
						const labelSize = this.getNodeParameter('labelSize', i, '4x6') as string;
						const thermalDpi = Number(this.getNodeParameter('thermalDpi', i, 203));

						let cropBox = { x: 24, y: 448, width: 547, height: 370 };
						if (carrier === 'flipkart') {
							cropBox = { x: 24, y: 448, width: 547, height: 370 };
						} else if (carrier === 'amazon') {
							cropBox = { x: 30, y: 460, width: 535, height: 350 };
						} else if (carrier === 'meesho') {
							cropBox = { x: 20, y: 420, width: 555, height: 400 };
						} else if (carrier === 'delhivery') {
							cropBox = { x: 28, y: 450, width: 540, height: 365 };
						} else {
							cropBox = { x: 20, y: 430, width: 550, height: 380 };
						}

						const pixelW = thermalDpi === 300 ? 1200 : 812;
						const pixelH = thermalDpi === 300 ? 1800 : 1218;

						result = {
							carrier,
							cropBox,
							pageFormat,
							labelSize,
							thermalDpi,
							dimensions: {
								inches: { width: 4, height: 6 },
								points: { width: 288, height: 432 },
								pixels: { width: pixelW, height: pixelH },
							},
							printableAreaPct: Math.round(((cropBox.width * cropBox.height) / (595 * 842)) * 1000) / 10,
							reference: 'https://www.devdeskapp.com/shipping-label-cropper',
						};
					}
				}

				returnData.push({ json: result, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
