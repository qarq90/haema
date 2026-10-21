import {
    SiGithub,
    SiX,
    SiYoutube,
    SiInstagram,
    SiFacebook,
    SiDiscord,
} from "react-icons/si";

export const quickLinks = [
    { label: "Donate Blood", href: "/donate" },
    { label: "Request Blood", href: "/request-blood" },
    { label: "Find a Camp", href: "/camps" },
    { label: "Schedule Checkup", href: "/checkup" },
    { label: "Blood News", href: "/news" },
];

export const supportLinks = [
    { label: "Contact Us", href: "/contact-us" },
    { label: "About Us", href: "/about-us" },
    { label: "FAQs", href: "/faqs" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-of-service" },
];

export const socials = [
    { icon: SiGithub, href: "/", label: "GitHub" },
    { icon: SiX, href: "/", label: "X" },
    { icon: SiYoutube, href: "/", label: "YouTube" },
    { icon: SiInstagram, href: "/", label: "Instagram" },
    { icon: SiFacebook, href: "/", label: "Facebook" },
    { icon: SiDiscord, href: "/", label: "Discord" },
];
