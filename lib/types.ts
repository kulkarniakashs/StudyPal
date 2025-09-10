export enum role {
    user,
    bot
}

export enum action {
  "delete",
  "share"
}

export type chatDetails = {
    title : string,
    id : string,
    updatedAt : string
}

export type chatList = chatDetails[];

export type message = {
  role : role
  content: string,
}

export type Chat = chatDetails & {
      messages: message[],
      createdAt: string
};


export type details = Record<string, {
  title : string,
  updatedAt : string,
  createdAt : string
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