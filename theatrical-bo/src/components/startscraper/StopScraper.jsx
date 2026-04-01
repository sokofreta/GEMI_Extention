import { useEffect, useState } from "react";
import axios from "axios";
export default function StopScraper() {
    const [data, setData] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.post("http://localhost:1000/stopScraping");

                setData(() => {
                    return res.data;
                });
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    return <div>{data&&data.message}</div>;
}
