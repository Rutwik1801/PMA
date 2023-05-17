import React from "react";
import { UserAuth } from "../store/AuthContext";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logOut, user } = UserAuth();

  const navigate = useNavigate();

  return (
    <>
      <nav className={styles.nav}>
        <div>
          <Link to="/">
            <img src="/logo.svg" alt="logo" className={styles.nav__img} />
          </Link>
        </div>
        <div className={styles.navLink__container}>
          {user && (
            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className={styles.nav_dashboard__btn}
              >
                Dashboard
              </button>
            </div>
          )}
          {user && (
            <div>
              <button onClick={logOut} className={styles.nav_logout__btn}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
