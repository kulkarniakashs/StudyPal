export enum role {
  user,
  bot
}

export enum action {
  "delete",
  "share"
}

export type chatDetails = {
  title: string,
  id: string,
  updatedAt: string
}

export type chatList = chatDetails[];

export type message = {
  role: role
  content: string,
}

export type Chat = chatDetails & {
  messages: message[],
  createdAt: string
};


export type details = Record<string, {
  title: string,
  updatedAt: string,
  createdAt: string
}>

export type chatMessageList = Record<string, message[]>;


export type ChatListState = {
  chats: chatList,
  loading: boolean,
  error: undefined | string,
};

export type RichContentBlock =
  | { type: "title"; text: string }
  | { type: "subtitle"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; code: string }
  | { type: "table"; headers: string[]; rows: string[][] };

// The rich message itself
export type RichMessage = {
  type: "rich_message";
  content: RichContentBlock[];
};

export enum request_type {
  new_chat,
  question
}

export type request = { request_type: request_type.new_chat, question : string } | { request_type : request_type.question, question : string , chatid : string}

export enum response_type {
  chat_id,
  content,
  chat_title
}

export type response = { response_type: response_type.chat_id, chat_id: string } | { response_type: response_type.chat_title, chat_title: string } | { response_type: response_type.content, content: string }