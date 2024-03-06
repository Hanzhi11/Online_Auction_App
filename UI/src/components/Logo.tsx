import { Link } from 'react-router-dom';

export default function Logo() {
    return (
        <Link
            className='min-w-fit flex items-center cursor-pointer mr-auto'
            to='/'
        >
            <img src='/logo.svg' className='h-8 mr-3' />
            <span className='text-white tracking-[0.3em] text-3xl'>BIDNOW</span>
        </Link>
    );
}
