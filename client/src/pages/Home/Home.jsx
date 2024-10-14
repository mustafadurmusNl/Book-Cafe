import React from "react";
import TEST_ID from "./Home.testid";
import Meta from "../../components/Meta.jsx";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <Meta
        title="Home - Book Cafe"
        description="Discover amazing books at Book Cafe."
      />
      {/* <h1>This is the homepage</h1>
      <p>Good luck with the project!</p> */}
    </div>
  );
};

export default Home;
