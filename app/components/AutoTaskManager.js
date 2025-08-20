"use client"

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import Input from "./ui/Input";
import { useAutoTask } from "../context/AutoTaskContext";
import { X, ShareIcon, File, XCircle, Trash, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const AutoTaskManager = () => {
    const { t } = useTranslation("common");
    const { isAutoTask, setAutoTask, getResponse, isLoading, updates, setUpdates } = useAutoTask();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const fileRef = useRef(null);

    const handleInput = (event) => {
        setMessage(event.target.value);
    };

    const handleFileInput = () => {
        fileRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setUploaded(true);
        }
    };

    const sendRequest = async () => {
        if (!message || message?.length < 9) return;
        const data = { message, file };
        await getResponse(data);
    };

    const colorType = (type) => {
        if (type && type == "accepted") return { color: "white", background: "#4b0" };
        else return { color: "#daa", background: "#d66" };
    };

    const cleanUp = () => {
        if (!message || message?.length < 10) return;
        setMessage("");
        setFile(null);
        setUploaded(false);
    };

    const getContent = (actionName) => {
        switch (actionName?.toLowerCase()) {
            case "growth": return "📊";
            case "vaccination": return "💉";
            case "doctor_contact": return "📞";
            case "feeding": return "🍼";
            case "essentials": return "📦";
            case "memory": return "🖼";
            case "sleep": return "😴";
            case "notification": return "🔴";
            default: return "❓";
        }
    };

    useEffect(() => {
        const trackMove = (e) => {
            setPosition({
                x: (e.clientX / window.innerWidth * 4.5),
                y: (e.clientY / window.innerHeight) * 5.5
            });
        };

        window.addEventListener('mousemove', trackMove);

        return () => {
            window.removeEventListener('mousemove', trackMove);
            setAutoTask(false);
        };
    }, []);

    const handleUpdates = () => {
        return updates.map((msg, i) => {
            const emoji = getContent(msg.actionName);
            return (
                <div style={colorType(msg?.request)} className="p-2 rounded m-2 inline-block" key={i}>
                    {msg.isAction
                        ? t("autotaskmanager.taskSuccess", { emoji, task: msg.actionName })
                        : t("autotaskmanager.taskFailed", { task: msg.actionName })}
                </div>
            );
        });
    };

    return (
        <AnimatePresence>
            {isAutoTask &&
                <motion.div
                    initial={{ opacity: 0, y: 10, background: "#0000" }}
                    animate={{ opacity: 1, y: 0, background: "#caac" }}
                    exit={{ opacity: 0, y: -10, background: "#caaf" }}
                    transition={{ duration: 0.2 }}
                    className="fixed flex flex-col w-full h-full top-[80px] z-50 items-center justify-center ">

                    <X className="absolute top-0 right-0 z-[100] text-pink-500 m-4 hover:text-purple-700 cursor-pointer" onClick={() => setAutoTask(false)} />

                    <div className="flex-col mt-10 sm:mt-4 sm:flex-row flex items-center w-[95%] sm:w-[80%] z-50 bg-white rounded-xl shadow-lg border border-l-4 border-gray-200 m-4" >

                        <Input
                            value={message}
                            onInput={handleInput}
                            className="flex-grow !w-[95%]  sm:w-full m-4 p-2"
                            placeholder={t("autotaskmanager.manageLogsPlaceholder")}
                        />

                        <div className="m-2 w-full sm:w-auto flex items-center justify-end sm:justify-center">
                            {isLoading && <Loader2Icon className="animate-spin m-2" />}

                            {!uploaded ?
                                <div className="cursor-pointer">
                                    <ShareIcon onClick={handleFileInput} aria-disabled={isLoading} className="h-10 text-gray-500 hover:text-pink-500 font-light" />
                                    <input type="file" ref={fileRef} className="hidden" onChange={handleFileChange} />
                                </div> :
                                <div className="relative cursor-pointer bg-slate-100 p-2 rounded text-gray-300 hover:text-pink-500 flex flex-col justify-center items-center" onClick={() => { setUploaded(false); setFile(null); }}>
                                    <File className="h-auto w-auto font-light text-pink-500 hover:text-transparent" />
                                    {file.name.slice(0, 5) || "@"}
                                    <div className="absolute rounded hover:bg-[#eeea] items-center justify-center hover:text-red-700 text-transparent w-full h-full flex">
                                        <XCircle className=" h-8 w-8 " />
                                    </div>
                                </div>
                            }

                            <Button className=" text-white mx-4" onClick={() => { sendRequest(); cleanUp(); }}>
                                {t("autotaskmanager.setTask")}
                            </Button>
                        </div>
                    </div>

                    {/* ...SVG unchanged... */}

                    <div className="h-[100%] w-full">
                        <div className="p-5 w-full inline-flex justify-center">
                            <div>{handleUpdates()}</div>
                        </div>

                        {updates.length > 0 &&
                            <div className="flex items-center justify-center">
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Trash onClick={() => setUpdates([])} className="bg-white p-2 rounded h-10 w-10 hover:text-green-900 cursor-pointer">
                                        {t("autotaskmanager.clear")}
                                    </Trash>
                                </motion.button>
                            </div>
                        }
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
};

export default AutoTaskManager;
