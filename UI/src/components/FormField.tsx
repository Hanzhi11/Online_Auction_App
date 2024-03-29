import classNames from "classnames";

interface Props {
    className?: string;
    labelContent: string;
    children: JSX.Element | JSX.Element[];
    isRequired?: boolean;
    errorMessage?: string | undefined;
}
const labelBaseStyle =
    'block leading-6 text-gray-900 mb-2 md:text-sm lg:text-base';

const labelStyleRequired = classNames(labelBaseStyle,
    'after:content-["*"] after:ml-0.5',
);

const errorStyle = 'text-red-600 mt-2';

export default function FormField(props: Props) {
    const { className, labelContent, children, isRequired = true, errorMessage } =
        props;

    const labelStyle = isRequired
        ? classNames(labelStyleRequired, {
              'after:text-red-600': errorMessage,
          })
        : labelBaseStyle;

    return (
        <div className={className}>
            <label className={labelStyle}>
                {labelContent}
            </label>
            {children}
            {errorMessage && <small className={errorStyle}>{errorMessage}</small>}
        </div>
    );
}
