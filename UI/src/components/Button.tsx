import className from 'classnames';

interface Props {
    type: string;
    children: string;
    height: string;
    width?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    id: string;
}

function Button(props: Props) {
    const { type, children, height, onClick, width, id } = props
    const buttonWidth = width ? width : 'w-full'
    const style = className('rounded hover:cursor-pointer', height, buttonWidth, {
        'bg-green-500': type === 'primary',
        'hover:bg-green-600': type === 'primary',
        'bg-white': type === 'secondary', 
        'text-indigo-900': type === 'secondary',
        'hover:bg-slate-200': type === 'secondary'
    })
    return <button id={id} className={style} onClick={onClick}>
        {children}
    </button>
}

export default Button