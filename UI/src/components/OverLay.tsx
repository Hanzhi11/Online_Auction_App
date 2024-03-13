import { IoClose } from 'react-icons/io5';
import ReactDOM from 'react-dom';
import { useContext, useEffect } from 'react';
import { ELEMENT_ID } from '../shared/Constants';
import Button from './Button';
import { IconContext } from 'react-icons';
import { OverLayContentContext } from '../App';
import classNames from 'classnames';

interface Props {
    children: JSX.Element;
    className?: string;
}

function OverLay(props: Props) {
    const { children, className } = props;
    const { updateOverLayContent } = useContext(OverLayContentContext);

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, []);

    return ReactDOM.createPortal(
        <div
            className={classNames(
                'fixed inset-0 py-6 bg-indigo-900 flex flex-col overflow-auto z-9999 min-w-[280px]',
                className,
            )}
        >
            <div className='flex'>
                <IconContext.Provider
                    value={{
                        color: 'white',
                        size: '1.8rem',
                    }}
                >
                    <Button
                        id={ELEMENT_ID.CLOSE_OVERLAY_BUTTON}
                        width='w-fit'
                        className='ml-auto mr-3.5'
                        onClick={() => updateOverLayContent('')}
                    >
                        <IoClose />
                    </Button>
                </IconContext.Provider>
            </div>
            {children}
        </div>,
        document.querySelector('#overLay') as HTMLElement,
    );
}

export default OverLay;
