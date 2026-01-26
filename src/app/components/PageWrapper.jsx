"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageWrapper({ children }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // wait one frame so browser finishes paint
        requestAnimationFrame(() => setReady(true));
    }, []);

    return (
        <motion.main
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            {children}
        </motion.main>
    );
}
