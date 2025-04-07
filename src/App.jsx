import React, { useState } from "react";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import ChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import CreateChannel from "@sendbird/uikit-react/CreateChannel";
import "@sendbird/uikit-react/dist/index.css";

const App = () => {
  const USER_ID = import.meta.env.VITE_USER_ID;
  const APP_ID = import.meta.env.VITE_APP_ID;
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

  const [currentChannel, setCurrentChannel] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [createChannelType, setCreateChannelType] = useState("group"); // 'group' or 'direct'

  // Handle creating new channels
  const handleCreateChannel = () => {
    setShowCreateChannel(true);
    setCreateChannelType("group");
  };

  // Handle creating new direct messages
  const handleCreateDirectMessage = () => {
    setShowCreateChannel(true);
    setCreateChannelType("direct");
  };

  // Render header controls for creating chats
  const renderChannelControls = () => (
    <div
      style={{
        padding: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f3f3f3",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <h2 style={{ margin: 0 }}>SendBird Chat</h2>
      <div>
        <button
          onClick={handleCreateDirectMessage}
          style={{
            marginRight: "8px",
            padding: "8px 12px",
            background: "#742DDD",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          New Direct Message
        </button>
        <button
          onClick={handleCreateChannel}
          style={{
            padding: "8px 12px",
            background: "#742DDD",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          New Group Chat
        </button>
      </div>
    </div>
  );

  return (
    <div className="App" style={{ height: "100vh", width: "100%" }}>
      <SendbirdProvider
        appId={APP_ID}
        userId={USER_ID}
        accessToken={ACCESS_TOKEN}
      >
        {renderChannelControls()}

        <div style={{ display: "flex", height: "calc(100% - 60px)" }}>
          {/* Channel List */}
          <div
            style={{
              width: "320px",
              borderRight: "1px solid #e0e0e0",
              height: "100%",
            }}
          >
            <GroupChannelList
              onChannelSelect={(channel) => {
                if (channel && channel.url) {
                  console.log(channel);
                  setCurrentChannel(channel);
                } else {
                  console.warn(
                    "Selected channel is null or missing url property"
                  );
                }
              }}
            />
          </div>

          <div style={{ flex: 1, height: "100%" }}>
            {showCreateChannel && (
              <CreateChannel
                onChannelCreated={(channel) => {
                  setCurrentChannel(channel);
                  setShowCreateChannel(false);
                }}
                onCancel={() => setShowCreateChannel(false)}
              />
            )}

            {!showCreateChannel && currentChannel && !showSettings && (
              <GroupChannel
                channelUrl={currentChannel.url}
                onChannelModified={(channel) => {
                  setCurrentChannel(channel);
                }}
                onChatHeaderActionClick={() => {
                  setShowSettings(true);
                }}
              />
            )}

            {!showCreateChannel && currentChannel && showSettings && (
              <ChannelSettings
                channelUrl={currentChannel.url}
                onCloseClick={() => {
                  setShowSettings(false);
                }}
              />
            )}

            {!showCreateChannel && !currentChannel && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <p>Select a chat or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </SendbirdProvider>
    </div>
  );
};

export default App;
