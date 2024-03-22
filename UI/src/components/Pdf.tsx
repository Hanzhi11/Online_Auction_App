import { useParams } from 'react-router-dom';

function Pdf() {
    const { id } = useParams();

    const url = `${import.meta.env.VITE_BASE_URL}/Pdf/Get/${id}`

    return <iframe src={url} className='h-screen w-screen'></iframe>;
}

export default Pdf;
