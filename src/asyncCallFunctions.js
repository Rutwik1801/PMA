import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateDoc, deleteDoc } from "firebase/firestore";
import { collection, query, getDocs } from "firebase/firestore";


// get all projects
const userId = localStorage.getItem("userId");

const getAllProjects = async () => {
  const q = query(collection(db, "projects"));
  let data = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};

// To check project is there or not 
const checkProject = async (projectId) => {
  const q = query(collection(db, "projects"));
  let data = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.id);
  });
  return data;
}

// update a project
const editProject = async (projectId, projectData) => {
  const editSnap = await updateDoc(doc(db, "projects", projectId.toString()), {
    ...projectData,
  });
};

// Add a new project
const postProject = async (projectData) => {
  const postSnap = await setDoc(
    doc(db, "projects", projectData.id.toString()),
    {
      ...projectData,
    }
  );
  return projectData.id;
};

// delete a project
const deleteProject = async (projectId) => {
  const deleteSnap = await deleteDoc(doc(db, "projects", projectId.toString()));
};

// -------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// get all tasks
const getAllTasks = async (projectId) => {
  const querySnapshot = await getDocs(
    collection(db, "projects", projectId, "tasks")
  );
  let data = [];
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};

// update a task
const editTask = async (projectId, taskId, taskData) => {
  const editSnap = await updateDoc(
    doc(db, "projects", projectId.toString(), "tasks", taskId.toString()),
    {
      ...taskData,
    }
  );
};

// add a new task
const postTask = async (projectId, taskData) => {
  const postSnap = await setDoc(
    doc(db, "projects", projectId.toString(), "tasks", taskData.id.toString()),
    {
      ...taskData,
    }
  );

  return projectId;
};

// delete a task
const deleteTask = async (projectId, taskId) => {
  const deleteSnap = await deleteDoc(
    doc(db, "projects", projectId.toString(), "tasks", taskId.toString())
  );
};

// add newUser
const postUser = async (userData) => {
  const postSnap = await setDoc(doc(db, "users", userData.id.toString()), {
    ...userData,
  });
};

// get all users
const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  let data = [];
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};

// get currently logged in user
const getCurrentUser = async () => {
  const docRef = doc(db, "users", userId.toString());
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

// get all assigned users
const getAssignedUsers = async (projectId) => {
  const q = query(
    collection(db, "projects", projectId.toString(), "assignedUsers")
  );
  let data = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data() });
  });
  return data;
};

// add assigned Users
const postAssignedUsers = async (projectId, assignedUserData) => {
  // array of objects
  const postSnap = await setDoc(
    doc(
      db,
      "projects",
      projectId.toString(),
      "assignedUsers",
      projectId.toString()
    ),
    {
      ...assignedUserData,
    }
  );
};

// edit assigned Users
const editAssignedUsers = async (projectId, assignedUserData) => {
  // array of objects
  const postSnap = await updateDoc(
    doc(
      db,
      "projects",
      projectId.toString(),
      "assignedUsers",
      projectId.toString()
    ),
    {
      ...assignedUserData,
    }
  );
};

// get all assigned users
const getAssignedTaskUsers = async (projectId, taskId) => {
  const q = query(
    collection(
      db,
      "projects",
      projectId.toString(),
      "tasks",
      taskId.toString(),
      "assignedUsers"
    )
  );
  let data = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data() });
  });
  return data;
};

// add assigned Users
const postAssignedTaskUsers = async (projectId, taskId, assignedUserData) => {
  // array of objects
  const postSnap = await setDoc(
    doc(db, "projects", projectId.toString(), "tasks", taskId.toString(), "assignedUsers", projectId.toString()),
    {
      ...assignedUserData,
    }
  );
};

// Edit assigned task Users
const editAssignedTaskUsers = async (projectId, taskId, assignedUserData) => {
  // array of objects
  const postSnap = await updateDoc(
    doc(db, "projects", projectId.toString(), "tasks", taskId.toString(), "assignedUsers", projectId.toString()),
    {
      ...assignedUserData,
    }
  );
};

export {
  checkProject,
  editProject,
  deleteProject,
  postProject,
  getAllProjects,
  getAllTasks,
  editTask,
  deleteTask,
  postTask,
  postUser,
  getAllUsers,
  postAssignedUsers,
  editAssignedUsers,
  editAssignedTaskUsers,
  getAssignedUsers,
  getAssignedTaskUsers,
  postAssignedTaskUsers,
  getCurrentUser,
};
