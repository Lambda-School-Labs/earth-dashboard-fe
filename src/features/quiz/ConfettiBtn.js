import React, { useState, useEffect } from "react";
import Confetti from "react-dom-confetti";



export function ConfettiButton() {
    const [active, setActive] = useState(false);
    useEffect(() => {
        setActive(false);
    },[]);
    return (
        <button type='button' class="confetti-button" onClick={() => setActive(true)}>
            <Confetti active={active} />
            Push me!
        </button>
    );
}
