import { useEffect } from "react"

export default function useInterval(func: Function, per: number) {
    useEffect(() => {
        const interval = setInterval(() => {
            func();
        }, per*1000);

        return () => {
            clearInterval(interval);
        }
    }, []);
}