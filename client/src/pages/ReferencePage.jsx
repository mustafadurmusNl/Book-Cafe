import React, { useState } from "react";
import CategoryModal from "../components/CategoryModal";

const ReferencePage = () => {
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h1>Reference Page</h1>
      <p>Here you can select your favorite genres.</p>
      {showModal && <CategoryModal handleClose={handleClose} />}
    </div>
  );
};

export default ReferencePage;
