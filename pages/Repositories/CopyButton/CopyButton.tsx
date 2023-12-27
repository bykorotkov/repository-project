import React, { useState } from "react"
import clipboardCopy from "clipboard-copy"
import classes from "./CopyButton.module.scss"

interface CopyButtonProps {
    text: string
}

const CopyButton = ({ text }: CopyButtonProps) => {
    const [isCopied, setIsCopied] = useState<boolean>(false)

    const handleCopyClick = () => {
        clipboardCopy(text)
            .then(() => {
                setIsCopied(true)

                setTimeout(() => {
                    setIsCopied(false)
                }, 2000)
            })
            .catch((error) => {
                console.error("Failed to copy text:", error)
            })
    }

    return (
        <button
            className={classes.Button}
            onClick={handleCopyClick}
        >
            {isCopied ? "Copied" : "Copy"}
        </button>
    )
}

export default CopyButton
