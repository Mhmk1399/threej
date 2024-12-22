import React, { useState, useEffect } from "react";

const TypingEffect = ({ words = [""], speed = 100, pause = 2000 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0); // Track the current word
  const [charIndex, setCharIndex] = useState(0); // Track the current character

  useEffect(() => {
    let timeout;

    // Current word from the array
    const currentWord = words[wordIndex];

    if (charIndex < currentWord.length) {
      // If still typing the current word, add the next character
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentWord[charIndex]);
        setCharIndex(charIndex + 1);
      }, speed);
    } else {
      // After finishing the current word, pause, then move to the next one
      timeout = setTimeout(() => {
        setDisplayedText(""); // Clear the text for the next word
        setCharIndex(0); // Reset character index
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length); // Move to the next word, loop back to 0 at the end
      }, pause);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, words, wordIndex, speed, pause]);

  return (
    <div className="flex w-fit h-fit justify-center items-center">
      <h2 className="text-sm p-2 bg-black/30 rounded-xl text-nowrap font-bold absolute lg:top-[140px] mb-8 lg:text-xl md:top-1/4 md:text-lg top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {displayedText}
      </h2>
    </div>
  );
};

export default TypingEffect;
