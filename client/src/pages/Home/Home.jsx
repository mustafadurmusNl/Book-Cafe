import React from "react";
import TEST_ID from "./Home.testid";
import Landing from "../../components/Landing";
import AuthForm from "../../components/AuthForm";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <Landing />
      <AuthForm />
    </div>
  );
};

export default Home;
