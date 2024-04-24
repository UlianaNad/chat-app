import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUsedId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data);

    if ("onLine" in messageData) {
      showOnlinePeople(messageData.onLine);
    }
  };

  const showOnlinePeople = (peopleArray) => {
    const people = {};

    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  return (
    <div className="flex h-screen">
      <div className=" bg-white w-1/3 ">
        <Logo />
        {Object.keys(onlinePeople).map((userId) => (
          <div
            onClick={() => setSelectedUserId(userId)}
            className={
              "border-b border-gray-100 py-2 pl-4 flex items-center gap-2 cursor-pointer " +
              (userId === selectedUsedId ? "bg-blue-50" : "")
            }
            key={userId}
          >
            <Avatar username={onlinePeople[userId]} userId={userId} />
            <span className="text-gray-800"> {onlinePeople[userId]}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-100  w-2/3 p-2">
        <div className="flex-grow">messages</div>
        <div className="flex gap-2">
          <input
            type="text"
            className="bg-white flex-grow border p-2 rounded-sm"
            placeholder="Start to type!"
          />
          <button className="bg-blue-500  p-2 text-white rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
