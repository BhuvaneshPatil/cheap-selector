"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../app/page.module.css";

interface MEMBER {
  name: string;
  id: number;
  image: string;
}
let SLECTED_MEMBERS: any[] = [];
for (let idx = 0; idx < 40; idx++) {
  SLECTED_MEMBERS.push({
    name: `Person - ${idx + 1}`,
    id: idx,
    image: "https://randomuser.me/api/portraits/thumb/men/75.jpg",
  });
}

console.log(SLECTED_MEMBERS);

const ChipSelector = () => {
  const [selectedMembers, setSelectedMembers] = useState<MEMBER[]>([]);
  const [suggestionsList, setSuggestionsList] = useState(SLECTED_MEMBERS);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suggestedIndex, setSuggestedIndex] = useState(-1);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState("");
  const addItem = (index: number) => {
    setSelectedMembers([...selectedMembers, suggestionsList.at(index)]);
    setSuggestionsList(
      suggestionsList.filter((item) => item.id !== suggestionsList[index].id)
    );
    setHighlightedIndex(-1);
  };

  const removeItem = (id: number) => {
    setSelectedMembers(selectedMembers.filter((item) => item.id !== id));
    setSuggestionsList([
      ...suggestionsList,
      SLECTED_MEMBERS.find((item) => item.id === id),
    ]);
  };

  useEffect(() => {
    if (highlightedIndex === -1) return;
    setSuggestedIndex(-1);
  }, [highlightedIndex]);

  useEffect(() => {
    if (suggestedIndex === -1) return;
    setHighlightedIndex(-1);
  }, [suggestedIndex]);

  return (
    <div className={`${styles.box} ${isFocus ? styles.highlighted : ""}`}>
      {selectedMembers.map((item, index) => {
        return (
          <div
            className={
              styles.selected +
              ` ${highlightedIndex === index ? styles.highlighedChip : ""}`
            }
            key={item.id}
            onClick={() => removeItem(item.id)}
          >
            {item.name}
          </div>
        );
      })}
      <div className={styles.autoSuggestion}>
        <input
          type="search"
          placeholder="Enter text here"
          className={styles.inputBox}
          onFocus={() => setIsFocus(true)}
          onChange={(e) => {
            setValue(e.target.value);
            setSuggestionsList(
              SLECTED_MEMBERS.filter((item) => {
                return (
                  item.name.includes(e.target.value) &&
                  !selectedMembers.find((el) => el.id === item.id)
                );
              })
            );
            setHighlightedIndex(-1);
            setSuggestedIndex(-1);
          }}
          onBlur={() => {
            setIsFocus(false);
            setSuggestedIndex(-1);
            setHighlightedIndex(-1);
          }}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              if (suggestedIndex !== -1) {
                addItem(suggestedIndex);
                return;
              }
            }
            if (event.keyCode === 40 || event.keyCode === 38) {
              setSuggestedIndex(suggestedIndex + (event.keyCode - 39));
            }

            if (event.key !== "Backspace") {
              return;
            }
            if (value.length !== 0) return;
            if (selectedMembers.length === 0) return;
            if (highlightedIndex === -1) {
              setHighlightedIndex(selectedMembers.length - 1);
              return;
            }
            let clonedList: MEMBER[] = [...selectedMembers];
            const removed = clonedList.pop();
            if (!removed) return;
            removeItem(removed.id);
            setHighlightedIndex(clonedList.length - 1);
            // setSelectedMembers(clonedList);
          }}
        />
        {isFocus ? (
          <ul className={styles.suggestionsList} role="listbox">
            {suggestionsList.length ? (
              suggestionsList.map((item, index) => {
                return (
                  <li
                    key={item.id}
                    className={`${styles.suggestedItem} ${
                      index === suggestedIndex ? styles.highlightItem : ""
                    }`}
                    ref={(r) => {
                      if (!r) return;
                      if (index !== suggestedIndex) return;
                      r.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                      });
                    }}
                    onMouseDown={(e) => {
                      addItem(index);
                      e.preventDefault();
                    }}
                  >
                    {item.name}
                  </li>
                );
              })
            ) : (
              <li>No item found</li>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default ChipSelector;
