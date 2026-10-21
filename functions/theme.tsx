export const applyTheme = (mode: "light" | "dark") => {
    const dark = mode === "dark";
    const root = document.documentElement;

    root.style.setProperty("--background", dark ? "#171717" : "#ffffff");
    root.style.setProperty("--foreground", dark ? "#ffffff" : "#171717");
    root.style.setProperty("--hover", dark ? "#323232" : "#cccccc");

    root.classList.toggle("dark", dark);
};
