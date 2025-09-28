import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Search = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false); // control panel visibility
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const reqIdRef = useRef(0); // to ignore out-of-order responses

  function handelchange(e) {
    const value = e.currentTarget.value;
    setSearch(value);
    // show panel when user types
    setShowResults(true);
  }

  // perform request (internal)
  const doSearch = async (q, myReqId) => {
    if (!q || q.trim().length === 0) {
      setResult([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8005/search/${encodeURIComponent(q)}`
      );
      // ignore stale responses
      if (reqIdRef.current !== myReqId) return;
      setResult(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      // ignore stale responses
      if (reqIdRef.current !== myReqId) return;
      console.error(error);
      setResult([]);
    } finally {
      if (reqIdRef.current === myReqId) setLoading(false);
    }
  };

  // debounce effect: when `search` changes, wait 300ms then call doSearch
  useEffect(() => {
    // clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!search || search.trim().length === 0) {
      // empty search -> hide results (but keep panel if focused)
      setResult([]);
      setLoading(false);
      // don't auto-show "موردی یافت نشد" when empty
      return;
    }

    // schedule new request after debounce
    const currentReq = ++reqIdRef.current;
    timerRef.current = setTimeout(() => doSearch(search.trim(), currentReq), 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // immediate manual (button / Enter)
  async function handelclick() {
    if (!search || search.trim().length === 0) {
      setResult([]);
      setShowResults(true);
      return;
    }
    const myReq = ++reqIdRef.current;
    await doSearch(search.trim(), myReq);
    setShowResults(true);
  }

  // go to hair card (as before)
  const gotoHair = (item) => {
    const el = document.getElementById(`hair-${item.pk}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.querySelector?.(".hair-click")?.click?.();
      el.focus?.();
    } else {
      navigate(`/hairs#hair-${item.pk}`);
    }
    // hide results after navigation/selection
    setShowResults(false);
  };

  return (
    <>
      <div className="search" onBlur={(e) => {
        // وقتی فوکوس از ورودی/نتایج خارج شد، پنل را ببند
        // اما اگر فوکوس داخل پنل یا روی آیتم رفت، نپوشان
        // timeout کوتاه برای اجازه کلیک روی آیتم
        setTimeout(() => setShowResults(false), 120);
      }}>
        <input
          className="search-input"
          type="text"
          placeholder="جست و جو بین مدل موها"
          value={search}
          onChange={handelchange}
          onFocus={() => setShowResults(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handelclick();
            }
            if (e.key === "Escape") {
              setShowResults(false);
            }
          }}
          aria-label="جستجوی مدل مو"
        />
        <button
          className="search1 search-btn"
          onMouseDown={(e) => e.preventDefault()} // جلوگیری از blur قبل از click
          onClick={handelclick}
          disabled={loading}
          aria-label="جستجو"
        >
          {loading ? "در حال جستجو..." : "جستجو"}
        </button>

        {/* render results only when needed */}
        {showResults && (
          <ul
            className={`result ${(!showResults || (!loading && result.length === 0 && search.trim() === "")) ? "hidden" : ""}`}
            role="listbox"
            aria-live="polite"
          >
            {loading ? (
              <li className="result-empty">در حال جستجو...</li>
            ) : result.length === 0 ? (
              <li className="result-empty">موردی یافت نشد</li>
            ) : (
              result.map((item, i) => (
                <li
                  className="result1"
                  key={item.pk ?? i}
                  role="option"
                  onMouseDown={(e) => e.preventDefault()} // جلوگیری از blur قبل از کلیک
                  onClick={() => gotoHair(item)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") gotoHair(item);
                  }}
                >
                  <div className="title">{item.name}</div>
                  <div className="meta">{item.category?.name ?? ""}</div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default Search;