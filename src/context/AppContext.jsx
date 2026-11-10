import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../data/storage";

const AppContext = createContext(null);

/* Simple hash-based router: #/browse, #/report, #/item/<id>, #/my-reports */
function useHashRoute() {
  const parse = () => {
    const [path, qs = ""] = (window.location.hash.replace(/^#\/?/, "") || "browse").split("?");
    const parts = path.split("/");
    return { page: parts[0], param: parts[1], query: Object.fromEntries(new URLSearchParams(qs)) };
  };
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const navigate = useCallback((path) => {
    window.location.hash = "/" + path;
  }, []);
  return [route, navigate];
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => api.getSessionUser());
  const [items, setItems] = useState(() => api.getItems());
  const [toast, setToast] = useState(null);
  const [route, navigate] = useHashRoute();

  const notify = useCallback((message, kind = "success") => {
    setToast({ message, kind, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const login = (email, password) => setUser(api.loginUser(email, password));
  const register = (data) => api.registerUser(data);
  const logout = () => {
    api.logoutUser();
    setUser(null);
    navigate("browse");
  };

  const reportItem = (data) => {
    const item = api.addItem({ ...data, ownerId: user.id });
    setItems(api.getItems());
    return item;
  };
  const setStatus = (id, status) => setItems(api.updateItem(id, { status }));
  const removeItem = (id) => setItems(api.deleteItem(id));

  return (
    <AppContext.Provider
      value={{
        user, login, register, logout,
        items, reportItem, setStatus, removeItem,
        getUserById: api.getUserById,
        route, navigate,
        toast, notify,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
