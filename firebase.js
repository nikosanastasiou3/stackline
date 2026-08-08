/* Stackline — Firebase sync (ES module) */
/* ============================================================
   Firebase sync — Auth (Google) + Firestore.
   Data model: one document per log date, so two devices editing
   different days can never overwrite each other.
     users/{uid}/logs/{YYYY-MM-DD}
     users/{uid}/meta/{prefs|routines|milestones}
   Offline cache is on, so the app works with no signal and
   syncs when the connection returns.
============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
         getRedirectResult, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
         doc, setDoc, deleteDoc, collection, getDocs, writeBatch }
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBRHf881EB23hi3CBHLzbXPLfJw217iDK8",
  authDomain: "stackline-333333.firebaseapp.com",
  projectId: "stackline-333333",
  storageBucket: "stackline-333333.firebasestorage.app",
  messagingSenderId: "486336854112",
  appId: "1:486336854112:web:a0b2a474324cef956bab05"
};

let app, auth, db, ready=false;
try{
  app  = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = initializeFirestore(app, {
    localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
  });
  ready = true;
}catch(err){ console.warn("Firebase init failed:", err); }

const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, {detail}));

window.SL_FB = {
  available: ready,
  user: null,
  async signIn(){
    if(!ready) throw new Error("unavailable");
    const provider = new GoogleAuthProvider();
    try{ await signInWithPopup(auth, provider); }
    catch(e){
      // popups are unreliable on mobile browsers — fall back to a full redirect
      if(/popup|cancelled|blocked/i.test(e.code||e.message||"")) await signInWithRedirect(auth, provider);
      else throw e;
    }
  },
  async signOut(){ if(ready) await signOut(auth); },
  async pull(){
    if(!ready || !window.SL_FB.user) return null;
    const uid = window.SL_FB.user.uid;
    const out = {logs:[], prefs:null, routines:null, milestones:null};
    const ls = await getDocs(collection(db, "users", uid, "logs"));
    ls.forEach(d=> out.logs.push(d.data()));
    const ms = await getDocs(collection(db, "users", uid, "meta"));
    ms.forEach(d=>{ const v=d.data(); out[d.id] = {data:v.data, u:v.u||0}; });
    return out;
  },
  async push(payload){
    if(!ready || !window.SL_FB.user) return;
    const uid = window.SL_FB.user.uid;
    const batch = writeBatch(db);
    (payload.logs||[]).forEach(l=> batch.set(doc(db,"users",uid,"logs",l.date), l));
    (payload.deletes||[]).forEach(dt=> batch.delete(doc(db,"users",uid,"logs",dt)));
    ["prefs","routines","milestones","customDrills","deskLogs","daySwaps","classLogs","customMoves"].forEach(k=>{
      if(payload[k]) batch.set(doc(db,"users",uid,"meta",k), {data:payload[k].data, u:payload[k].u||Date.now()});
    });
    await batch.commit();
  }
};

if(ready){
  getRedirectResult(auth).catch(()=>{});
  onAuthStateChanged(auth, u=>{
    window.SL_FB.user = u ? {uid:u.uid, email:u.email, name:u.displayName} : null;
    emit("sl-auth", {user: window.SL_FB.user});
  });
}else{
  emit("sl-auth", {user:null, unavailable:true});
}
