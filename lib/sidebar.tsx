import {
    FiHome,
    FiAlertCircle,
    FiHeart,
    FiSearch,
    FiPackage,
    FiCalendar,
    FiFileText,
} from "react-icons/fi";

export const items = [
    { label: "Home", Icon: FiHome, path: "/" },
    { label: "Emergency SOS", Icon: FiAlertCircle, path: "/emergency" },
    { label: "Donate", Icon: FiHeart, path: "/donate" },
    { label: "Request", Icon: FiSearch, path: "/request" },
    { label: "Inventory", Icon: FiPackage, path: "/inventory" },
    { label: "Camps", Icon: FiCalendar, path: "/camps" },
    { label: "News", Icon: FiFileText, path: "/news" },
];