import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from 'react';

interface submitButton {
    preText: string;
    postText: string;
    ispending: boolean;
}

interface submitButtonProps {
    submitButtonContent: submitButton;
}

const SubmitButton: React.FC<submitButtonProps> = ({ submitButtonContent }) => {
    return (
        <Button type="submit" className="w-32 bg-gray-200 hover:bg-sky-600 hover:text-white flex justify-center mx-auto" disabled={submitButtonContent.ispending}>
        {submitButtonContent.ispending ? (
            <><div className="text-black flex">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {`${submitButtonContent.postText}`}...
            </div>
            </>
        ) : (
            `${submitButtonContent.preText}`
        )}
    </Button>
    )
}

export default SubmitButton