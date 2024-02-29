import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Pdf() {
    const { id } = useParams();
    const [url, setUrl] = useState(`/${id}`);

    useEffect(() => {
        if (id) {
            document.title = id
        }
        setUrl(`/${id}`)
    }, [id])
    
    return <iframe src={url} className="h-screen w-screen"></iframe>;
}

export default Pdf;
