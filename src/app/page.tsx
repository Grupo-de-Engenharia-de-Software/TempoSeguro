"use client";

import { useEffect } from "react";

import { useRouter } from "src/routes/hooks";

import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if(window.Notification){
      window.Notification.requestPermission().then((permission) => {
        console.log("Permissão de notificação:", permission);
      });
    }

    router.push(CONFIG.auth.redirectPath);
  }, [router]);

  return null;
}
