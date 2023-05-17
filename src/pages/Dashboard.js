import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ProjectCard } from "../components/ProjectCard";
import { deleteProject, getAllProjects, postUser } from "../asyncCallFunctions";
import { onSnapshot,collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { getCurrentUser } from "../asyncCallFunctions";
import { Link } from "react-router-dom";
import { UserAuth } from "../store/AuthContext";
import { useParams } from "react-router-dom";
import { Blocks } from "react-loader-spinner";

const Dashboard = () => {
  const [isAdmin,setIsAdmin]=useState(false)
  const params=useParams();
  const {user}=UserAuth();
  const [projectsData, setProjectsData] = useState();

  const [isLoading, setIsLoading] = useState(false);
  // ROUTER FOR NAVIGATION
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      return navigate("/");
    }

    if(!user) {
      return setIsLoading(true);
    }

    const userData = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      admin: false,
    };

    postUser(userData).then(() => {});

    setIsLoading(true);
    
    onSnapshot(collection(db, "projects"), (projectsData) => {
      let data = [];
      projectsData.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setProjectsData(data)
      setIsLoading(false)
      return data;
    });
    getCurrentUser().then((res) => {
      setIsAdmin(res.admin);
    });
  }, [user]);

  // deletes a particular project
  const handleDelete = async (id) => {
    deleteProject(id).then(() => {
      getAllProjects().then((data) => {
        setProjectsData(data);
      });
    });
  };

  return (
    <div style={{ backgroundColor: "#f0fdf4", minHeight: "100vh" }}>
      <Navbar />
     {isAdmin && <h1>Heyy,You&apos;re an Admin</h1>}
      <div className={styles.btn__container}>
        <Link to="/new-project">
          <button className={styles.addProject__btn}>ADD NEW PROJECT</button>
        </Link>
      </div>

      <div
        className={styles.loaderSpinner__container}
        style={{ display: `${isLoading ? "flex" : "none"}` }}
      >
        {isLoading && (
          <Blocks
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
          />
        )}
      </div>

      {!isLoading && (
        <div className={styles.dashboard__container}>
          <div className={styles.projectCard__container}>
            {projectsData &&
              projectsData.map((project) => {
                // individual project
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    handleDelete={handleDelete}
                    setProjectsData={setProjectsData}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
