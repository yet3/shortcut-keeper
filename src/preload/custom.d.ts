import type { Database } from "better-sqlite3";
import type { IpcMainInvokeEvent } from "electron";
import type { IApi, IApiKeys } from ".";

export type IEndpointParams<TChannel extends IApiKeys> = Parameters<
	IApi[TChannel]
>[0];

export type IEndpointReturn<TChannel extends IApiKeys> = Parameters<
	IApi[TChannel]
>[1];

export type IEndpointErrorDetails<TChannel extends IApiKeys> = Parameters<
	IApi[TChannel]
>[2];

export type ISuccessResp<TChannel extends IApiKeys> = {
	data: IEndpointReturn<TChannel>;
};

export type IErrorResp<TChannel extends IApiKeys> = {
	error: {
		message: string;
		details: IEndpointErrorDetails<TChannel>;
	};
};

export type IResponse<TChannel extends IApiKeys> =
	| ISuccessResp<TChannel>
	| IErrorResp<TChannel>;

export type IEndpointCtx<TChannel extends IApiKeys> = {
	event: IpcMainInvokeEvent;
	success: (data: IEndpointReturn<TChannel>) => ISuccessResp<TChannel>;
	error: (
		message: string,
		...details: IEndpointErrorDetails<TChannel> extends never
			? [undefined?]
			: [IEndpointErrorDetails<TChannel>]
	) => IErrorResp<TChannel>;
};

export type IInvokeApi = <TChannel extends IApiKeys>(
	channel: TChannel,
	...params: IEndpointParams<TChannel> extends never
		? [undefined?]
		: [IEndpointParams<TChannel>]
) => Promise<IResponse<TChannel>>;

export interface WindowApi {
	api: IInvokeApi;
}
