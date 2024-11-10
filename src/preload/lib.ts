import { ipcMain, ipcRenderer } from "electron";
import type { IApiKeys } from ".";
import type {
	IEndpointCtx,
	IEndpointErrorDetails,
	IEndpointParams,
	IInvokeApi,
	IResponse,
} from "./custom";

export const declareEndpoint = <TParams, TReturn, TErrorDetails = never>(
	_: TParams,
	__: TReturn,
	___: TErrorDetails,
) => {};

export const makeApi = <T extends Record<string, unknown>>(api: T): T => {
	return api;
};

export const makeEndpoint = async <TChannel extends IApiKeys>(
	channel: TChannel,
	callback: (
		ctx: IEndpointCtx<TChannel>,
		arg: IEndpointParams<TChannel>,
	) => Promise<IResponse<TChannel>>,
) => {
	ipcMain.handle(channel, async (event, args) => {
		const context: IEndpointCtx<TChannel> = {
			event,
			success: (data) => {
				return {
					data,
				};
			},
			error: (message, ...details) => {
				console.log(message, details);
				return {
					error: {
						message,
						details: details[0] as IEndpointErrorDetails<TChannel>,
					},
				};
			},
		};
		try {
			const resp = await callback(context, args);
			return resp;
		} catch (e) {
			console.log(e);
			console.error(e);
			return {
				error: {
					message: `${e?.toString()}`,
					details: {
						error: e,
					},
				},
			};
		}
	});
};

export const invokeApi: IInvokeApi = (channel, ...params) => {
	return ipcRenderer.invoke(channel, params ? params[0] : undefined);
};
