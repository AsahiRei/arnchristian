import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { readFileSync } from "fs";
import { join } from "path";

function getFirebaseApp() {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

const fallbackPng = readFileSync(join(process.cwd(), "public", "icon.png"));

export default async function GET() {
  try {
    const app = getFirebaseApp();
    const db = getFirestore(app);
    const snap = await getDoc(doc(db, "profile", "main"));
    const avatar = snap.data()?.avatar as string | undefined;

    if (!avatar) {
      return new Response(fallbackPng, {
        headers: { "Content-Type": "image/png" },
      });
    }

    const res = await fetch(avatar);
    if (!res.ok) {
      return new Response(fallbackPng, {
        headers: { "Content-Type": "image/png" },
      });
    }

    const contentType = res.headers.get("content-type") ?? "image/png";
    return new Response(res.body, {
      headers: { "Content-Type": contentType },
    });
  } catch {
    return new Response(fallbackPng, {
      headers: { "Content-Type": "image/png" },
    });
  }
}
