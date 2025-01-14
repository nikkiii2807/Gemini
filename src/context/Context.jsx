import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const context = createContext();

const ContextProvider = ({ children }) => {

    const [input,setInput]=useState("");
    const [recentPrompt, setRecentPrompt]=useState("");
    const [prevPrompt, setPrevPrompt]=useState([]);
    const [showResult,setShowResult]=useState(false);
    const [loading, setLoading]=useState(false);
    const [resultData,setResultData]=useState("");

    const newChat=()=>{
        setLoading(false)
        setShowResult(false)
    }

    const delayPara=(index,nextWord)=>{
        setTimeout(function() {
            setResultData(prev=>prev+nextWord);
        }, 75*index);
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt!==undefined){
            response=await runChat(prompt);
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompt(prev=>[...prev,input])
            setRecentPrompt(input)
            response=await runChat(input)
        }
        
        let responseArray=response.split("**");
        let newResponse="";
        for(let i=0;i<responseArray.length;i++){
            if(i==0|| i%2!==1){
                newResponse+=responseArray[i]
            }
            else{
                newResponse+="<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2=newResponse.split("*").join("</br>")
        let newResponsearray=newResponse2.split(" ")
        for(let i=0;i<newResponsearray.length;i++){
            const nextWord=newResponsearray[i];
            delayPara(i,nextWord+" ")
        }

       
        setLoading(false)
        setInput("")
    };

    // Remove the immediate onSent call here. Trigger it elsewhere in your app when needed.
   
    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <context.Provider value={contextValue}>
            {children}
        </context.Provider>
    );
};

export default ContextProvider;
