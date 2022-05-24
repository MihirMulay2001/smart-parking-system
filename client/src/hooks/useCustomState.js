import { useEffect, useRef, useState } from "react";

export function useCustomState(initialValue){
    const [state, setState] = useState(initialValue)
    const cbref = useRef()
    const setCustomState = (newState, callback) => {
        cbref.current =  callback;
        setState(newState)
    }
    useEffect(()=>{
        if(cbref.current){
            cbref.current(state);
        }
        cbref.current = undefined
    },[state])
    return [state, setCustomState]
}