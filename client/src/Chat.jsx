import React from "react";

const Chat = () => {
  return (
    <div className="flex h-screen">
      <div className="bg-blue-100 w-1/3">
        Contacts
      </div>
      <div className="bg-blue-300 w-2/3">
        <div>messages</div>
        <div>
            <input type="text" className="bg-white" placeholder="Start to type!"/>
            </div>
      </div>
    </div>
  );
};

export default Chat;
