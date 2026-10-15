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
		icon: 'file:devdeskapp.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Run 330+ developer utilities, data formatters, and calculators from DevDeskApp',
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
						action: 'Calculate in-hand salary',
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
