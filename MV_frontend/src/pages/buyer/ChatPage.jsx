import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatBox from "../../components/ChatBox";
import api from "../../utils/api";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [ownerUserId, setOwnerUserId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "customer") return;

    const fetchAdminId = async () => {
      try {
        const res = await api.get("/chat/admin-id/");
        setOwnerUserId(res.data?.admin_id || null);
      } catch {
        setOwnerUserId(null);
      }
    };

    fetchAdminId();
  }, [user?.id, user?.role]);

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  return (
    <ChatBox
      show={true}
      handleClose={handleClose}
      currentUser={user}
      otherUserId={ownerUserId}
    />
  );
};

export default ChatPage;
