import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type ChatId = string;
export interface Chat {
    id: ChatId;
    title: string;
    messagesJson: string;
    platform: string;
    timestamp: Timestamp;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ChatSummary {
    id: ChatId;
    title: string;
    platform: string;
    timestamp: Timestamp;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    deleteChat(id: string): Promise<void>;
    fetchChatPage(url: string): Promise<string>;
    getChat(id: string): Promise<Chat>;
    listChats(): Promise<Array<ChatSummary>>;
    saveChat(id: ChatId, title: string, platform: string, messagesJson: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
