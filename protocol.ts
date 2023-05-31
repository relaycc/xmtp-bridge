import { DecodedMessage } from "@xmtp/xmtp-js";

export type ShouldHandleMessage = ({
  message,
}: {
  message: DecodedMessage;
}) => boolean;

export type ValidateMessage = ({
  message,
}: {
  message: DecodedMessage;
}) => boolean;

export type MapMessageToRequest = <Req>({
  message,
}: {
  message: DecodedMessage;
}) => Req;

export type CallHttpApi = <Req, Res>({
  request,
}: {
  request: Req;
}) => Promise<Res>;

export type ValidateHttpResponse = <Res>({
  response,
}: {
  response: Res;
}) => boolean;

export type MapResponseToContent = <Res>({
  response,
}: {
  response: Res;
}) => string;
