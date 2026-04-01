import { useState } from "react";
import StartScraper from "./startscraper/StartScraper";

export const ScrapMovies = () => {
    const [start, setStart] = useState(false);
    const [stop, setStop] = useState(false);

    const handleStart = () => {
        setStart(true);
        setStop(false);
    };

    const handleStop = () => {
        setStop(true);
        setStart(false);
    };

    return (
        <div style={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
            <h1>Scrap Movies</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                <button onClick={handleStart} style={{ maxWidth: "120px", fontSize: "20px", background: "green", color: "#fff", borderRadius: "5px" }}>Start</button>
                {/* <button onClick={handleStop} style={{ maxWidth: "100px", fontSize: "20px", background: "red", color: "#fff", borderRadius: "5px" }}>Stop</button> */}
            </div>
            {start && !stop && <StartScraper selectedRange={'100'} url="movies" stop={stop} />}
        </div>
    );
};