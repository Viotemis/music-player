import { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { useFormikContext, Field } from "formik";
import { useSearchHistory } from "../store";

const SearchBar = () => {
  const { submitForm, setFieldValue } = useFormikContext();
  const [historyVisible, setHistoryVisible] = useState(false);
  const {
    list: history,
    removeOne,
    removeAll: clearHistory,
    load: loadHistory,
  } = useSearchHistory();

  const [init, setInit] = useState(true);

  useEffect(() => {
    if (init) {
      setInit(false);
      loadHistory();
    }
  }, [init]);

  return (
    <div className="relative flex-1 flex items-center gap-4 h-10 w-full sm:w-72 sm:focus-within:w-96 rounded-full bg-slate-300/80 focus-within:bg-slate-300/60 shadow-sm transition-all duration-300">
      <Field
        id="searchText"
        name="searchText"
        placeholder="What do you want to hear?"
        className="peer pl-6 pr-4 flex-1 text-sm bg-transparent outline-none truncate"
        onFocus={() => {
          setHistoryVisible(true);
        }}
        onBlur={() => {
          setHistoryVisible(false);
        }}
      />
      <HiSearch
        size={24}
        className="flex-none w-12 aspect-square text-slate-400 cursor-pointer transition-all duration-300 rounded-full"
        onClick={submitForm}
      />

      {/* History pop up*/}
      <AnimatePresence>
        {historyVisible && (
          <motion.div
            variants={{
              show: { opacity: 1, y: 0, transition: { ease: "easeInOut" } },
              hidden: { opacity: 0, y: -10, transition: { ease: "easeInOut" } },
            }}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="absolute top-[100%] right-0 left-0 mt-2 bg-white shadow-md rounded-md overflow-hidden z-10"
          >
            {history.map((item, i) => (
              <li
                key={`${item} ${i}`}
                className="group px-4 h-10 text-sm flex items-center hover:bg-slate-100 cursor-pointer transition-all duration-300"
              >
                <span
                  className="h-full min-w-[0] flex-1 truncate flex items-center"
                  onClick={() => {
                    setFieldValue("searchText", item);
                    submitForm();
                  }}
                >
                  {item}
                </span>
                <span
                  className="hidden group-hover:inline-block hover:underline text-xs text-slate-500 hover:text-slate-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOne(item);
                  }}
                >
                  Delete
                </span>
              </li>
            ))}
            <div className="px-4 h-10 flex items-center">
              <div className="flex-1"></div>
              <span
                className="inline-block text-sm hover:underline text-slate-500 hover:text-slate-800 cursor-pointer"
                onClick={() => clearHistory()}
              >
                Clear All
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
