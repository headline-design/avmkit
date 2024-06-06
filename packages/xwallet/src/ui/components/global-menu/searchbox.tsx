//apply a '.focus' class to the input when it is focused
//add a onFocus event listener to the div that wraps the input

import { cn } from "@/lib/utils";
import { useState } from "react";
import { IconSearch } from "../../../icons";

const Searchbox = ({ onSearch }) => {
  const [inFocus, setInFocus] = useState(false);

  return (
    <div
      onFocus={() => setInFocus(true)}
      className={cn(
        inFocus ? "focus" : "",
        "xwallet-input-search xwallet-input xwallet-input-md xwallet-search-input-box",
      )}
    >
      <div className="xwallet-input-box">
        <span className="xwallet-input-prefix">
          <IconSearch />
        </span>
        <input
          onBlur={() => setInFocus(false)}
          type="text"
          placeholder="Search network name"
          className="xwallet-input-input"
          autoCapitalize="off"
          autoCorrect="off"
          onChange={(e) => onSearch(e.target.value)}
          autoComplete="off"
          name="search_network"
        />
        <div className="xwallet-input-suffix">
          <i className="icon iconfont xwallet-input-search-suffix-icon suffix-icon" />
        </div>
      </div>
    </div>
  );
};

export default Searchbox;
