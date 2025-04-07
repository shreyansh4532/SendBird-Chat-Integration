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

  return (
    <div className="App h-screen w-full">
      <SendbirdProvider
        appId={APP_ID}
        userId={USER_ID}
        accessToken={ACCESS_TOKEN}
      >
        <div className="flex h-[calc(100%-60px)]">
          {/* Channel List */}
          <div className="w-[320px] border-r border-gray-300 h-full">
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

          <div className="flex-1 h-full">
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
              <div className="flex justify-center items-center h-full bg-gray-100">
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
