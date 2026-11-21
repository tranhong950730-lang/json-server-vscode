import * as assert from 'assert';
import * as http from 'http';
import express from 'express';
import { JSONServeRoutes } from '../server/createRoutes';
import { Helper } from '../server/utils/helper';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('supports slash-separated keys in POST and API GET routes', async () => {
		Helper.setJSONObject({
			'auth/validate-token': { isValid: true },
		});

		const app = express();
		app.use(express.json());
		app.use('/', JSONServeRoutes());
		const server = await listen(app);
		Helper.setServer(server);

		try {
			assert.deepStrictEqual(
				await requestJson(server, 'POST', '/auth/validate-token'),
				{ isValid: true },
			);
			assert.deepStrictEqual(
				await requestJson(server, 'GET', '/api/auth/validate-token'),
				{ isValid: true },
			);
		} finally {
			await new Promise<void>((resolve) => server.close(() => resolve()));
		}
	});
});

function listen(app: express.Express): Promise<http.Server> {
	return new Promise((resolve) => {
		const server = app.listen(0, '127.0.0.1', () => resolve(server));
	});
}

function requestJson(server: http.Server, method: string, route: string): Promise<unknown> {
	const address = server.address();
	if (!address || typeof address === 'string') {
		throw new Error('Test server has no TCP address');
	}

	return new Promise((resolve, reject) => {
		const req = http.request({
			host: '127.0.0.1',
			port: address.port,
			method,
			path: route,
		}, (res) => {
			let body = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => body += chunk);
			res.on('end', () => {
				try {
					resolve(JSON.parse(body));
				} catch (error) {
					reject(error);
				}
			});
		});
		req.on('error', reject);
		req.end();
	});
}
