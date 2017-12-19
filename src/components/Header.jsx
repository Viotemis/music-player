import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiMenu, HiX } from "react-icons/hi";
import { useHeader } from "../store";
import { HiChevronLeft } from "react-icons/hi";
import IconContainer from "./icons/IconContainer";
import { navItems } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Form, Formik } from "formik";
import { search } from "../api";

const navItemUrls = navItems.map((m) => m.url);
const isRootPath = (path) => navItemUrls.includes(path);
const headerAbsoluteUrls = ["/album/[id]", "/artist/[id]"];

const mobile_transition = {
  duration: 0.5,
  // ease: "easeOut",
  type: "spring",
  // damping: 12,
  // bounce: 0.9,
};

const mobile_menu_variants = {
  hidden: {
    opacity: 0,
    x: "100%",
    transition: mobile_transition,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: mobile_transition,
  },
};

const mobile_menu_overlay = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};

const NavItem = ({ item, i, close }) => {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    close();
    router.push(item.url);
  };
  return (
    <li className="w-full relative group">
      <a
        onClick={handleClick}
        className={`w-full h-12 flex items-center px-4 rounded-lg group-hover:bg-blue-300 transition-all duration-300 ${
          router.pathname === item.url ? `bg-blue-200` : "bg-slate-100"
        }`}
      >
        {item.text}
      </a>
      {router.pathname === item.url && (
        <div
          className={`absolute -right-6 top-0 bottom-0 w-1.5 rounded-lg bg-blue-300 group-hover:bg-blue-400 transition-all duration-300`}
        ></div>
      )}
    </li>
  );
};

const MobileMenu = ({ close, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-800/60 z-40"
            variants={mobile_menu_overlay}
            initial="hidden"
            animate="show"
            exit="hidden"
          ></motion.div>
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-slate-200 shadow-lg"
            variants={mobile_menu_variants}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <div className="w-full h-full px-8">
              <div className="h-16 flex items-center">
                <div className="flex-1"></div>
                <IconContainer onClick={close}>
                  <HiX size={24} />
                </IconContainer>
              </div>
              <ul className="py-6 flex flex-col gap-4">
                {navItems.map((item, i) => (
                  <NavItem key={i} item={item} i={i} close={close} />
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const HeaderContainer = ({ children, className = "" }) => {
  return (
    <header
      className={`w-full px-8 h-16 flex-none flex items-center z-20 ${className}`}
    >
      {children}
    </header>
  );
};

const SearchForm = () => {
  return (
    <Formik
      initialValues={{
        searchText: "",
      }}
      onSubmit={(values) => {
        console.log("submit", values);
        search({ keywords: values.searchText })
          .then((res) => {
            console.log("search response", res);
          })
          .catch((err) => console.error(err));
      }}
    >
      {({ values }) => {
        return (
          <Form className="hidden sm:flex">
            <SearchBar />
          </Form>
        );
      }}
    </Formik>
  );
};

export default function Header() {
  const { defaultHeaderClassName, title, showSearchBar } = useHeader();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <HeaderContainer className={`${defaultHeaderClassName}`}>
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className={` ${isRootPath(router.pathname) ? "hidden" : ""}`}>
          <IconContainer onClick={() => router.back()}>
            <HiChevronLeft size={24} className="" />
          </IconContainer>
        </div>
        <span className="inline-block lg:hidden text-xl font-medium line-clamp-1">
          {title}
        </span>
        {/* {showSearchBar && <SearchForm />} */}
      </div>

      {/* Middle */}
      <div className="flex-1"></div>

      {/* Right */}
      <div className="block lg:hidden">
        <IconContainer
          onClick={() => {
            setMobileMenuOpen(true);
          }}
        >
          <HiMenu size={24} className="" />
        </IconContainer>
        <MobileMenu
          isOpen={mobileMenuOpen}
          close={() => setMobileMenuOpen(false)}
        />
      </div>
    </HeaderContainer>
  );
}
