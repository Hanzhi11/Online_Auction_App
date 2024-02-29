import className from 'classnames';

interface Props {
    type?: string;
    children: string | JSX.Element | JSX.Element[];
    height?: string;
    width?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    id?: string;
    classNames?: string;
}

function Button(props: Props) {
    const { type, children, height, onClick, width, id, classNames } = props
    const buttonWidth = width ? width : 'w-full'
    const style = className('rounded hover:cursor-pointer', 'flex justify-center items-center', height, buttonWidth, {
        'bg-green-500': type === 'primary',
        'hover:bg-green-600': type === 'primary',
        'text-white': type === 'primary',
        'bg-white': type === 'secondary', 
        'text-indigo-900': type === 'secondary',
        'hover:bg-slate-200': type === 'secondary'
    }, classNames)
    return <button id={id} className={style} onClick={onClick}>
        {children}
    </button>
}

export default Button