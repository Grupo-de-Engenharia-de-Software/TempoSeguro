"use client";

import { useCallback, useEffect, useMemo } from "react";
import { _mock } from "src/_mock";

import { useSetState } from "src/hooks/use-set-state";

import axios, { endpoints } from "src/utils/axios";

import { AuthContext } from "../auth-context";
import { IS_ADMIN_STORAGE_KEY, STORAGE_KEY } from "./constant";
import { isValidToken, setSession } from "./utils";

import type { AuthState } from "../../types";

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      const isAdmin = sessionStorage.getItem(IS_ADMIN_STORAGE_KEY) === "true";

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken, isAdmin);

        const res = await axios.get(endpoints.auth.me);

        const { user } = res.data;

        if (isAdmin) {
          user.role = "admin";
          user.photoURL = _mock.image.avatar(24);
          user.displayName = "Administrator";
          user.email = "admin@admin.com"
        } else {
          user.role = "user";
          user.photoURL = _mock.image.avatar(12);
          user.displayName = "User";
          user.email = "user@user.com"
        }

        console.log(user)

        setState({
          user: {
            ...user,
            accessToken,
          },
          loading: false,
          isAdmin,
        });
      } else {
        setState({ user: null, loading: false, isAdmin: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false, isAdmin: false });
    }
  }, [setState]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? "admin",
          }
        : null,
      isAdmin: state.isAdmin,
      checkUserSession,
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
    }),
    [checkUserSession, state.user, state.isAdmin, status],
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
