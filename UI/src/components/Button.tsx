import classNames from 'classnames';
import { forwardRef, Ref } from 'react';

interface Props {
    type?: 'submit' | 'reset' | 'button' | undefined;
    children: string | JSX.Element | JSX.Element[];
    height?: string;
    width?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    id?: string;
    className?: string;
    disabled?: boolean;
    primary?: boolean;
    secondary?: boolean;
}

export default forwardRef<HTMLButtonElement, Props>(function Button(
    props: Props,
    ref: Ref<HTMLButtonElement>,
) {
    const {
        children,
        height,
        onClick,
        width,
        id,
        className,
        disabled = false,
        type = 'button',
        primary,
        secondary
    } = props;
    const buttonWidth = width ? width : 'w-full';
    const style = classNames(
        'rounded cursor-pointer',
        'flex justify-center items-center',
        height,
        buttonWidth,
        {
            'enabled:bg-green-500 disabled:bg-neutral-300 enabled:hover:bg-green-600 enabled:text-white disabled:text-black':
                primary,
            'bg-white text-indigo-900 hover:bg-slate-200': secondary,
        },
        className,
    );
    return (
        <button
            id={id}
            className={style}
            onClick={onClick}
            disabled={disabled}
            ref={ref}
            type={type}
        >
            {children}
        </button>
    );
});
