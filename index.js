/**
 * Autor: jl_
 * ADSI - SENA
 * email: devluisluzardo@gmail.com
 * Fecha creacion : 21 - Sept- 2023
 * 
 * desscripcion:
 * 
**/

//Firebase: Authentication
//Google Firebase : Google Popu up
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

//Firebase: RealTime Database
import {
  getDatabase,
  ref,
  set,
  onValue,
  query, 
  orderByKey,
  get,
  limitToLast,
  equalTo, 
  child,
  update
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

let direccion="", celular="", ciudad="";

//Firebase: Initialize service
const firebaseApp = initializeApp({
    apiKey: "AIzaSyCjw1LBpUPDCVfh5jvHN6_MJkm3k-utfYE",
    authDomain: "ivsiglesiaregatco.firebaseapp.com",
    databaseURL: "hts://ivsiglesiaregatco-default-rtdb.firebaseio.com",
    projectId: "ivsiglesiaregatco",
    storageBucket: "ivsiglesiaregatco.firebasestorage.app",
    messagingSenderId: "892878960949",
    appId: "1:892878960949:web:93bc8715bc0de5b9cd747c",
    measurementId: "G-K4L55LN63M"
});


const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider(firebaseApp);

// Asignamos el objeto a la constante
// Obtenemos el elemento, imagen,...
const login  = document.getElementById("accedergoogle");
const cerrarsesion  = document.getElementById("cerrarsesion");
const emailsesion = document.getElementById("emailinisesion");
const logininac = document.getElementById("logininac");
const loginac = document.getElementById("loginac");
const myDiv = document.getElementById("sliderinisesion");

login.addEventListener("click", (e) => {
  signInWithRedirect(auth, provider);
   
  getRedirectResult(auth)
  .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});



//CERRAR SESION :   

cerrarsesion.addEventListener("click", (e) => {
 auth.signOut()
  .then(() => {
    // Cierre de sesión exitoso
    document.getElementById("login").style.display = "block";
    //habilitar cuentas google
    document.getElementById("accedergoogle").style.display = "block";
    //Ocultar Cerrar sesion
    document.getElementById("cerrarsesion").style.display = "none";     
    //Mostrar texto          
    document.getElementById("emailinisesion").innerText = "Email";          
    ////console.log('Sesión cerrada correctamente.');
    // Aquí puedes redirigir al usuario a una página de inicio de sesión o mostrar un mensaje de confirmación.
  })
  .catch((error) => {
    // Manejo de errores
    console.error('Error al cerrar sesión:', error);
  });
});
//---


//AL cambiar el estado de autenticacion
onAuthStateChanged(auth, (user) => {
  if (user) {
      const uid    = user.uid;
      const uname  = user.displayName;
      const uemail = user.email;
      let id       = 1;

      const emailEncoded = btoa(uemail); // Codificar el email en Base64
      const db = getDatabase();

      const dbf = ref(db, 'usuario/idkey:' + emailEncoded);
      onValue(dbf, (snapshot) => {
        let data = snapshot.val();
      
        if (data !== null) {
                 
          // Si data no es nulo, significa que hay un valor en el nodo
       ///console.log('Hay un valor en el nodo: ......... ');
          //console.log(data);
          
          //--- porque el usuario ya fue autenticado
          //ocultar login
          document.getElementById("login").style.display = "none";
          //ver login activo.
          document.getElementById("loginactivo").style.display = "block";          
          //bloquear cuentas google
          document.getElementById("accedergoogle").style.display = "none";          
          //ver Cerrar sesion
          document.getElementById("cerrarsesion").style.display = "block"; 
          //Modtrar texto          
          document.getElementById("emailinisesion").innerText = uemail;       
          //myDiv.style.backgroundColor = "lightblue";
          //---
        }
        else {
          //--- porque el usuario no ha sido autenticado
          //Ver login
          document.getElementById("login").style.display = "block";
          //ocultar login activo.
          document.getElementById("loginactivo").style.display = "none";      
          //Ocultar Cerrar sesion
          document.getElementById("cerrarsesion").style.display = "none";     
          //Mostrar texto          
          document.getElementById("emailinisesion").innerText = "Email";
          //myDiv.style.backgroundColor = "lightblue";
          
          //---  
          // Si data es nulo, significa que no hay un valor en el nodo
          console.log('No hay un valor en el nodo');
          const path = 'usuario/idkey:' + emailEncoded;
          // Luego, puedes usar 'path' en tu función set
          set(ref(db, path), {
            nombre: uname,
            email: uemail,
            key: uid,
            idrol: 4,
            idnivel: 2
          });
          
         }
         
      });
      // ...
  } 
  else {
    // User is signed out
    //Desplegamos
    login.style.display = "block";
    loginactivo.style.display = "none";
    emailsesion.style.display = "none";
    cerrarsesion.style.display = "none";
    logininac.style.display = "block";
    loginac.style.display = "none";
    //myDiv.style.backgroundColor = "lightblue";
  }
});



