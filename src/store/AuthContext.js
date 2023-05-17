import { useContext, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getAllUsers, postUser } from "../asyncCallFunctions";
import { auth } from "../firebaseConfig";

// CREATING AUTH CONTEXT
const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  // SETTING UP USER STATE
  const [user, setUser] = useState(null);

  // FOR PROGRAMMATIC NAVIGATION
  const navigate = useNavigate();

  // GOOGLE SIGN IN HANDLER
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        getAllUsers().then(data=>{
          // if user already exists then dont add to users collection
         const findUser=(ele)=>{
            return ele.id===user.uid
          }
         if(!data.find(findUser)){
          const userData={
            id:user.uid,
            name:user.displayName,
            email:user.email,
            photo:user.photoURL,
            admin:false
          }
          postUser(userData).then(()=>{
          })
         }
        })
        // SETTING UP USER ID
        localStorage.setItem("userId", user.uid);
        // WHEN LOGGED IN => PUSH TO DASHBOARD
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        console.log("Auth Failed!");
      });
  };

  // SIGN OUT HANDLER
  const logOut = () => {
    signOut(auth);
    localStorage.removeItem("userId");
    navigate("/");
  };

  // SETTING UP USER IF LOGGED IN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
