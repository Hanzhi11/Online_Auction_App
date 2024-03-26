import { useParams } from 'react-router-dom';

function Pdf() {
    const { id, about } = useParams();

    document.title = (id as string).split('.')[0].replaceAll('_', ' ');
    const url = `${import.meta.env.VITE_BASE_URL}/Pdf/Get/${id}?About=${about}`;

    return <iframe src={url} className='h-screen w-screen'></iframe>;
}

export default Pdf;
