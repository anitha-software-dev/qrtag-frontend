// Init
import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useRef,
  useImperativeHandle,
  createRef,
} from "react";

// Initializing Create Context Hook
const storeContext = createContext();
const storeUpdateContext = createContext();

// We are also initializing useContexts here then we only call these functions where we need that data
const InitialState = {
  loggedIn: false,
  user: {},
  channels: [],
  messages: [],
  notification: false,
  firebaseToken: null,
  cookies: [],
  cartItems: []
};
export function Store() {
  return useContext(storeContext);
}

export function UpdateStore() {
  return useContext(storeUpdateContext);
}
export function ResetStore() {
  const updateStore = useContext(storeUpdateContext);
  return () => {
    updateStore(InitialState);
  };
}

export const StoreRef = createRef(InitialState);
export const UpdateStoreRef = createRef(null);
// export const UpdateStoreRef = { current: null };

// Initializing Store Provider
export function StoreProvider({ children }) {
  // Initializing State
  const isFirstTime = useRef(true);
  if (isFirstTime.current) {
    var init = InitialState;
    try {
      init = localStorage.getItem("store")
        ? JSON.parse(localStorage.getItem("store"))
        : InitialState;
    } catch (e) { }
  }
  let [store, setStore] = useState(init);

  useEffect(() => {
    if (isFirstTime.current) {
      isFirstTime.current = false;
      return;
    }
    StoreRef.current = store;
    localStorage.setItem("store", JSON.stringify(store));
  });

  const updateStore = (data) => {
    setStore((prev) => {
      return {
        ...prev,
        ...data,
      };
    });
  };
  useImperativeHandle(UpdateStoreRef, () => ({ updateStore }), []);

  // Render
  return (
    <storeContext.Provider value={store}>
      <storeUpdateContext.Provider value={updateStore}>
        {children}
      </storeUpdateContext.Provider>
    </storeContext.Provider>
  );
}
