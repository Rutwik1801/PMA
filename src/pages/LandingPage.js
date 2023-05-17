import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../store/AuthContext";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  // IMPORTS FROM CONTEXT
  const { googleSignIn, user } = UserAuth();

  // IMPORT FROM REACT ROUTER
  const navigate = useNavigate();

  // SIGN IN HANDLER
  const signInHandler = async () => {
    try {
      await googleSignIn();
    } catch (error) {
    }
  };

  return (
    <>
      <div className={styles.landingPage}>
        <div className={styles.landingPage__header}>
          <img src="/logo.svg" alt="logo" className={styles.header__img} />
          <h3>PMA</h3>
        </div>
        <div className={styles.landingPage__content}>
          <div className={styles.heading}>
            <h2 className={styles.heading__title}>Organize</h2>
            <h2 className={styles.heading__title}>Your Daily Task</h2>
          </div>
          <div className={styles.tagline__container}>
            <p className={styles.tagline__content}>
              PMA is famous project management web application for organizing
              daily life, task, challenges, statistics and so on.
            </p>
          </div>
        </div>
        <div className={styles.signin__container}>
          {/* IF USER NOT LOGGED IN */}
          {!user && (
            <button className={styles.signin__btn} onClick={signInHandler}>
              Sign In
            </button>
          )}
          {/* IF USER LOGGED IN */}
          {user && (
            <button
              className={styles.signin__btn}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
