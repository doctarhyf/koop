import { LogBox } from "react-native";

if (__DEV__) {
  const ignoreWarns = [
    "EventEmitter.removeListener",
    "[fuego-swr-keys-from-collection-path]",
    "Setting a timer for a long period of time",
    "Non-serializable values were found in the navigation state.",
    "VirtualizedLists should never be nested inside plain ScrollViews",
  ];

  const warn = console.warn;
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (typeof arg[0] === "string" && arg[0].startsWith(warning)) {
        return;
      }
    }
    warn(...arg);
  };

  LogBox.ignoreLogs(ignoreWarns);
}
