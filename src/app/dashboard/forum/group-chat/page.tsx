"use client";

import { useState } from "react";

// Define types
type Message = {
  sender: string;
  content: string;
  timestamp: string;
};

type Group = {
  id: number;
  name: string;
  description: string;
  messages: Message[];
};

export default function GroupChatPage() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Managing Anxiety",
      description: "A group for discussions on anxiety management.",
      messages: [
        {
          sender: "Alice",
          content: "Hello everyone, how are you managing today?",
          timestamp: "10:00 AM",
        },
        {
          sender: "Bob",
          content: "Doing better, thanks for asking!",
          timestamp: "10:05 AM",
        },
      ],
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState<Group>(groups[0]);
  const [newMessage, setNewMessage] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [editingMessage, setEditingMessage] = useState<number | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const updatedGroup: Group = {
        ...selectedGroup,
        messages: [
          ...selectedGroup.messages,
          {
            sender: "You",
            content: newMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      };
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === selectedGroup.id ? updatedGroup : group
        )
      );
      setSelectedGroup(updatedGroup);
      setNewMessage("");
    }
  };

  const handleEditMessage = (index: number, updatedContent: string) => {
    const updatedMessages = selectedGroup.messages.map((message, i) =>
      i === index ? { ...message, content: updatedContent } : message
    );
    const updatedGroup = { ...selectedGroup, messages: updatedMessages };
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === selectedGroup.id ? updatedGroup : group
      )
    );
    setSelectedGroup(updatedGroup);
    setEditingMessage(null);
  };

  const handleDeleteMessage = (index: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      const updatedMessages = selectedGroup.messages.filter((_, i) => i !== index);
      const updatedGroup = { ...selectedGroup, messages: updatedMessages };
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === selectedGroup.id ? updatedGroup : group
        )
      );
      setSelectedGroup(updatedGroup);
    }
  };

  const handleSelectGroup = (groupId: number) => {
    const group = groups.find((g) => g.id === groupId);
    if (group) setSelectedGroup(group);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const filteredMessages = selectedGroup.messages.filter((message) =>
    message.content.toLowerCase().includes(messageSearch.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 h-screen flex">
      {/* Group List */}
      <div className="w-1/4 bg-white shadow-lg rounded-xl p-4 mr-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Groups</h2>
        <input
          type="text"
          value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
          placeholder="Search Groups..."
          className="w-full p-2 border border-gray-300 rounded-sm mb-4"
        />
        <ul className="divide-y divide-gray-300">
          {filteredGroups.map((group) => (
            <li
              key={group.id}
              onClick={() => handleSelectGroup(group.id)}
              className={`p-3 cursor-pointer hover:bg-gray-200 rounded-lg transition ${
                selectedGroup.id === group.id ? "bg-gray-300" : ""
              }`}
            >
              <h3 className="font-bold text-gray-800">{group.name}</h3>
              <p className="text-gray-600 text-sm">{group.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="w-3/4 bg-white shadow-xl rounded-xl p-6 flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          {selectedGroup.name}
        </h2>
        <input
          type="text"
          value={messageSearch}
          onChange={(e) => setMessageSearch(e.target.value)}
          placeholder="Search Messages..."
          className="w-full p-2 border border-gray-300 rounded-sm mb-4"
        />
        <div className="flex-1 overflow-y-auto mb-4 border border-gray-300 rounded-xl p-4 bg-gray-50">
          {filteredMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md p-3 rounded-xl shadow-md relative ${
                  message.sender === "You"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="font-medium mb-1">{message.sender}</p>
                {editingMessage === index ? (
                  <input
                    type="text"
                    defaultValue={message.content}
                    onBlur={(e) => handleEditMessage(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                  />
                ) : (
                  <p>{message.content}</p>
                )}
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {message.timestamp}
                </p>
                {message.sender === "You" && (
                  <div className="absolute -top-3 -right-3 bg-white shadow-sm rounded-full flex items-center space-x-2 px-2 py-1">
                    <button
                      onClick={() => setEditingMessage(index)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(index)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-300 rounded-l-xl focus:outline-hidden shadow-xs"
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-600 text-white px-6 py-3 rounded-r-xl hover:bg-green-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
