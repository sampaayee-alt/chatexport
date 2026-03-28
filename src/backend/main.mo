import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";

actor {
  type Timestamp = Time.Time;
  type ChatId = Text;

  type Chat = {
    id : ChatId;
    title : Text;
    platform : Text;
    messagesJson : Text;
    timestamp : Timestamp;
  };

  type ChatSummary = {
    id : ChatId;
    title : Text;
    platform : Text;
    timestamp : Timestamp;
  };

  let chats = Map.empty<ChatId, Chat>();

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func fetchChatPage(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };

  public shared ({ caller }) func saveChat(id : ChatId, title : Text, platform : Text, messagesJson : Text) : async () {
    let chat : Chat = {
      id;
      title;
      platform;
      messagesJson;
      timestamp = Time.now();
    };
    chats.add(id, chat);
  };

  public query ({ caller }) func getChat(id : Text) : async Chat {
    switch (chats.get(id)) {
      case (null) { Runtime.trap("Chat " # id # " does not exist.") };
      case (?chat) { chat };
    };
  };

  public query ({ caller }) func listChats() : async [ChatSummary] {
    chats.values().toArray().map(
      func(chat) {
        {
          id = chat.id;
          title = chat.title;
          platform = chat.platform;
          timestamp = chat.timestamp;
        };
      }
    );
  };

  public shared ({ caller }) func deleteChat(id : Text) : async () {
    if (not chats.containsKey(id)) {
      Runtime.trap("Chat with id " # id # " does not exist. ");
    };
    chats.remove(id);
  };
};
